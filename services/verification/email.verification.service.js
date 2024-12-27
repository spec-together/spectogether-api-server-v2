const crypto = require("node:crypto");
const db = require("../../models");
const mailer = require("../../utils/mailer.util.js");
const customErrors = require("../../errors.js");
const encryptUtil = require("../../utils/encrypt.util.js");

const generateToken = () => crypto.randomInt(100000, 1000000).toString();

const sendVerification = async ({ email }) => {
  try {
    const code = generateToken();
    const verificationRecord = await db.VerificationCode.create({
      identifier_type: "email",
      identifier_value: email,
      verification_code: code,
    });
    await mailer.sendVerificationEmail(email, code);
    const encryptedCodeId = encryptUtil.encrypt62(
      verificationRecord.verification_code_id.toString()
    );
    return { id: encryptedCodeId };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new customErrors.DatabaseError(
        "이메일 인증 실패. 데이터베이스 오류입니다.",
        error
      );
    }
    if (error instanceof EmailSendingError) {
      throw error;
    }
    throw new customErrors.UnknownError(
      "이메일 인증 실패. 알 수 없는 오류가 발생했습니다."
    );
  }
};

const MAX_ATTEMPTS = 5; // 최대 시도 횟수

const verifyToken = async ({ id, code }) => {
  const decryptedCodeId = encryptUtil.decrypt62(id);
  const record = await db.VerificationCode.findOne({
    where: {
      verification_code_id: decryptedCodeId,
      identifier_type: "email",
      verification_code: code,
    },
  });

  if (record && record.attempt >= MAX_ATTEMPTS) {
    throw new customErrors.InvalidTokenError(
      "이메일 인증 실패. 시도 횟수 초과",
      {
        current_attempts: MAX_ATTEMPTS, // record.attempt 이지만
        max_attempts: MAX_ATTEMPTS,
        statusCode: 429,
      }
    );
  }

  if (!record) {
    const failedRecord = await db.VerificationCode.findOne({
      where: { verification_code_id: decryptedCodeId },
    });

    if (failedRecord) {
      failedRecord.attempt += 1;
      await failedRecord.save();

      if (failedRecord.attempt >= MAX_ATTEMPTS) {
        throw new customErrors.InvalidTokenError(
          "이메일 인증 실패. 시도 횟수 초과",
          {
            current_attempts: failedRecord.attempt,
            max_attempts: MAX_ATTEMPTS,
            statusCode: 429,
          }
        );
      }

      throw new customErrors.InvalidTokenError(
        "이메일 인증 실패. 토큰이 유효하지 않습니다.",
        {
          current_attempts: failedRecord.attempt,
          max_attempts: MAX_ATTEMPTS,
          // statusCode: 400, // 기본값
        }
      );
    }

    throw new customErrors.InvalidTokenError(
      "이메일 인증 실패. 토큰이 유효하지 않습니다."
    );
  }

  // await db.VerificationCode.destroy({ where: { verification_code_id: decryptedCodeId } });
  await record.update({ is_verified: true });
  // console.log(record);
  return;

  // TODO: 만료 시간 검증 추가
  // const now = Date.now();
  // const createdAt = new Date(record.created_at).getTime();
  // const TOKEN_EXPIRATION_TIME = 1000 * 60 * 60;
  // if (now - createdAt > TOKEN_EXPIRATION_TIME) {
  //   await emailVerificationRepo.deleteEmailVerificationCode(token);
  //   throw new InvalidTokenError(
  //     "이메일 인증 실패. 인증 토큰이 만료되었습니다."
  //   );
  // }
};

const verifyUnivEmail = async ({ userId, schoolId, codeId, code }) => {
  const decryptedCodeId = encryptUtil.decrypt62(codeId);
  // const decryptedSchoolId = encryptUtil.decrypt62(schoolId);
  const verificationCode = await db.VerificationCode.findByPk(decryptedCodeId, {
    attributes: [
      "verification_code_id",
      "verification_code",
      "attempt",
      "created_at",
      "is_verified",
      "identifier_value",
    ],
  });

  const school = await db.School.findOne({
    where: { school_id: schoolId },
  });

  // if (!school) {throw new customErrors.NotExistsError("존재하지 않는 학교입니다.")}

  if (!verificationCode) {
    throw new customErrors.NotExistsError("존재하지 않는 인증 코드입니다.");
  }

  const VERIFICATION_TIME_LIMIT = 5 * 60 * 1000;
  const now = Date.now();
  console.log("✨ ~ verifyUnivEmail ~ now:", now);
  const createdAt = new Date(verificationCode.created_at).getTime();
  console.log("✨ ~ verifyUnivEmail ~ createdAt:", createdAt);
  if (now - createdAt > VERIFICATION_TIME_LIMIT) {
    await verificationCode.destroy();
    throw new customErrors.TimeOutError("인증 시간이 만료되었습니다.");
  }

  if (verificationCode.attempt > MAX_ATTEMPTS) {
    await verificationCode.destroy();
    throw new customErrors.MaxAttemptsExceededError(
      "인증 시도 횟수를 초과하였습니다.",
      {
        current_attempts: verificationCode.attempt,
        max_attempts: MAX_ATTEMPTS,
      }
    );
  }

  if (verificationCode.verification_code !== code) {
    verificationCode.attempt += 1;
    await verificationCode.save();
    throw new customErrors.InvalidTokenError("인증 코드가 일치하지 않습니다.", {
      current_attempts: verificationCode.attempt,
      max_attempts: MAX_ATTEMPTS,
    });
  } else {
    await verificationCode.update({ is_verified: true });
    console.log("✨ ~ verifyUnivEmail ~ verificationCode:", verificationCode);
    const userSchool = await db.UserSchool.create({
      user_id: userId,
      school_id: schoolId,
      email: verificationCode.identifier_value,
    });
    console.log("✨ ~ verifyUnivEmail ~ userSchool:", userSchool);
    return;
  }
};

module.exports = {
  sendVerification,
  verifyToken,
  verifyUnivEmail,
};
