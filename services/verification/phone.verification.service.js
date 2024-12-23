const {
  NotExistsError,
  MaxAttemptsExceededError,
  TimeOutError,
  InvalidTokenError,
} = require("../../errors");
const logger = require("../../logger");
const db = require("../../models");
const {
  generate6DigitToken,
  encrypt62,
  decrypt62,
} = require("../../utils/encrypt.util");
const { sendSMS } = require("../aws/aws.send.message.service");

const checkPhoneUnique = async (phone) => {
  //
  const result = await db.User.findOne({
    attributes: [],
    where: {
      phone_number: phone,
    },
  });

  if (!result) {
    return true;
  }
  return false;
};

const sendTokenToPhone = async (phone) => {
  // 토큰을 생성하고, db에 저장하고, 사용자에게 전송

  const token = generate6DigitToken();
  const record = await db.VerificationCode.create({
    identifier_type: "phone",
    identifier_value: phone,
    verification_code: token,
  });

  // 입력값으로 들어오는 전화번호는 10으로 시작하고 공백이 존재하지 않아야 합니다.
  const southKoreaPhone = "+82" + phone.slice(1);
  const message = `[spectogether] 인증번호는 ${token} 입니다.\n절대 타인에게 노출하지 마세요.`;
  logger.debug(
    `[sendTokenToPhone]\n핸드폰번호: ${southKoreaPhone}\n메세지: ${message}`
  );

  await sendSMS(southKoreaPhone, message);

  return encrypt62(record.verification_code_id);
};

const verifyToken = async (id, token) => {
  // 1. DB에 존재하는 인증 세션인지 조회
  const decryptedId = decrypt62(id);
  logger.debug(`[verifyToken] decryptedId: ${decryptedId}`);
  const record = await db.VerificationCode.findByPk(decryptedId, {
    attributes: [
      "verification_code_id",
      "attempt",
      "verification_code",
      "created_at",
    ],
  });
  // 1-1. 존재하지 않는 세션인 경우 에러 리턴
  if (!record) {
    throw new NotExistsError("존재하지 않는 인증 세션입니다.");
  }

  // 2. 인증 시간 (5분을 초과하지는 않았는지 확인)
  const VERIFICATION_TIME_LIMIT = 5 * 60 * 1000; // 5분
  const now = Date.now();
  const createdAt = new Date(record.created_at).getTime();
  if (now - createdAt > VERIFICATION_TIME_LIMIT) {
    // 2-1. 만료된 인증세션인 경우 에러 리턴 및 해당 세션 삭제
    await record.destroy();
    throw new TimeOutError("인증 시간이 만료되었습니다.");
  }

  // 3. 인증 횟수를 초과하지는 않았는지 확인
  const MAX_ATTEMPTS = 5;
  if (record.attempt > MAX_ATTEMPTS) {
    // 3-1. 인증 시도 횟수를 초과한 경우 에러 리턴 및 해당 세션 삭제
    await record.destroy();
    throw new MaxAttemptsExceededError("인증 시도 횟수를 초과하였습니다.", {
      current_attempts: record.attempt,
      max_attempts: MAX_ATTEMPTS,
    });
  }

  // 4. 토큰 비교
  if (record.verification_code !== token) {
    // 4-1. 토큰이 일치하지 않는 경우 에러 리턴
    record.attempt += 1;
    await record.save();
    throw new InvalidTokenError("인증 코드가 일치하지 않습니다.", {
      current_attempts: record.attempt,
      max_attempts: MAX_ATTEMPTS,
    });
  }
  // 4-2. 토큰 일치하는 경우 true 리턴
  else {
    // 4-3. DB에서 인증세션 삭제
    await record.destroy();
    return true;
  }
};

module.exports = {
  checkPhoneUnique,
  sendTokenToPhone,
  verifyToken,
};
