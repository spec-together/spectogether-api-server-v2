const { EmailVerificationCode, User } = require("../models/index.js");
const { InvalidTokenError } = require("../errors.js");

const findUserByEmail = async (email) => {
  const exUser = await User.findOne({
    where: { email },
    attributes: ["email", "user_id"],
  });
  return exUser;
};

const saveEmailVerificationCode = async (email, code) => {
  const emailVerificationCode = await EmailVerificationCode.create({
    email,
    code,
  });
  return emailVerificationCode;
};

const findByEmailAndCode = async (email, code) => {
  const emailVerificationCode = await EmailVerificationCode.findOne({
    where: {
      email: email,
      code: code,
    },
  });
  return emailVerificationCode;
};

const deleteEmailVerificationCode = async (code) => {
  if (!code) {
    throw new InvalidTokenError("code parameter is required");
  }
  await EmailVerificationCode.destroy({ where: { code } });
  return true;
};

module.exports = {
  findUserByEmail,

  saveEmailVerificationCode,
  findByEmailAndCode,
  deleteEmailVerificationCode,
};
