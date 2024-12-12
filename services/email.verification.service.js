const crypto = require("nodo:crypto");
const { Op } = require("sequelize");
const emailVerificationRepo = require("../repositories/email.verification.repository.js");
const sendVerificationEmail = require("../utils/mailer.js");
const { AlreadyExistsError } = require("../errors.js");

const isEmailUniqueService = async (email) => {
  const user = await emailVerificationRepo.findUserByEmail(email);
  if (user === null) {
    return true;
  } else {
    throw new AlreadyExistsError();
  }
};

const generateToken = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const sendVerification = async (email) => {
  const code = await generateToken();
  await emailVerificationRepo.saveEmailVerificationCode(email, code);
  await sendVerificationEmail(email, code);
  return code;
};

const verifyToken = async (token) => {
  const record = await emailVerificationRepo.findByCode(token);
  if (!record) {
    throw new Error("이메일 인증 실패: 유효하지 않은 토큰입니다.");
  }
  // TODO: 만료 시간 검증 추가
  await emailVerificationRepo.deleteEmailVerificationCode(token);
  return record.email;
};

module.exports = {
  isEmailUniqueService,
  sendVerification,
  verifyToken,
};
