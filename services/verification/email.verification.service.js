const crypto = require("node:crypto");
// const { Op } = require("sequelize");

const emailVerificationRepo = require("../../repositories/email.verification.repository.js");
const sendVerificationEmail = require("../../utils/mailer.util.js");
const { AlreadyExistsError, InvalidTokenError } = require("../../errors.js");

const isEmailUnique = async (email) => {
  const user = await emailVerificationRepo.findUserByEmail(email);
  if (user === null) {
    return true;
  } else {
    throw new AlreadyExistsError("이미 사용 중인 이메일입니다.");
  }
};

const generateToken = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const sendVerification = async (email) => {
  const code = generateToken();
  await emailVerificationRepo.saveEmailVerificationCode(email, code);
  await sendVerificationEmail(email, code);
  return code;
};

const verifyToken = async (email, code) => {
  const record = await emailVerificationRepo.findByEmailAndCode(email, code);
  if (!record) {
    throw new InvalidTokenError(
      "이메일 인증 실패. 유효하지 않은 인증 토큰입니다."
    );
  }
  if (email !== record.email) {
    throw new InvalidTokenError(
      "이메일 인증 실패. 유효하지 않은 이메일입니다."
    );
  }
  await emailVerificationRepo.deleteEmailVerificationCode(code);
  // TODO : 지금은 유효하면 바로 삭제처리하고 FE에 인증 여부를 반환값으로 간접 제공. 인증 정보를 DB에 저장하는 방안도 고려해보자.
  return {
    email_verification_code_id: record.email_verification_code_id,
    email: record.email,
  };

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
  isEmailUnique,
  sendVerification,
  verifyToken,
};
