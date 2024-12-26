const crypto = require("node:crypto");
const { Sequelize, VerificationCode } = require("../../models/index.js");
// const { Op } = require("sequelize");
const mailer = require("../../utils/mailer.util.js");
const {
  DatabaseError,
  InvalidTokenError,
  EmailSendingError,
  UnknownError,
} = require("../../errors.js");

const generateToken = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const sendVerification = async ({ email }) => {
  try {
    const code = generateToken();
    const verificationRecord = await VerificationCode.create({
      identifier_type: "email",
      identifier_value: email,
      verification_code: code,
    });
    await mailer.sendVerificationEmail(email, code);
    return { id: verificationRecord.verification_code_id };
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      throw new DatabaseError(
        "이메일 인증 실패. 데이터베이스 오류입니다.",
        error
      );
    }
    if (error instanceof EmailSendingError) {
      throw error;
    }
    throw new UnknownError("이메일 인증 실패. 알 수 없는 오류가 발생했습니다.");
  }
};

const MAX_ATTEMPTS = 5; // 최대 시도 횟수

const verifyToken = async ({ id, code }) => {
  const record = await VerificationCode.findOne({
    where: {
      verification_code_id: id,
      identifier_type: "email",
      verification_code: code,
    },
  });

  if (record && record.attempt >= MAX_ATTEMPTS) {
    throw new InvalidTokenError("이메일 인증 실패. 시도 횟수 초과", {
      current_attempts: MAX_ATTEMPTS, // record.attempt 이지만
      max_attempts: MAX_ATTEMPTS,
      statusCode: 429,
    });
  }

  if (!record) {
    const failedRecord = await VerificationCode.findOne({
      where: { verification_code_id: id },
    });

    if (failedRecord) {
      failedRecord.attempt += 1;
      await failedRecord.save();

      if (failedRecord.attempt >= MAX_ATTEMPTS) {
        throw new InvalidTokenError("이메일 인증 실패. 시도 횟수 초과", {
          current_attempts: failedRecord.attempt,
          max_attempts: MAX_ATTEMPTS,
          statusCode: 429,
        });
      }

      throw new InvalidTokenError(
        "이메일 인증 실패. 토큰이 유효하지 않습니다.",
        {
          current_attempts: failedRecord.attempt,
          max_attempts: MAX_ATTEMPTS,
          // statusCode: 400, // 기본값
        }
      );
    }

    throw new InvalidTokenError("이메일 인증 실패. 토큰이 유효하지 않습니다.");
  }

  await VerificationCode.destroy({ where: { verification_code_id: id } });
  return record;

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

module.exports = {
  sendVerification,
  verifyToken,
};
