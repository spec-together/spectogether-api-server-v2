const emailVerificationService = require("../services/emailVerificationService");

const handleCheckEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUnique = await emailVerificationService.isEmailUniqueService(email);
    if (isUnique) {
      next();
    }
  } catch (error) {}
};

// sendVerificationEmailHandler
const handleSendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await emailVerificationService.sendVerification(email);
    res.status(200).success({ email, code });
  } catch (error) {
    next(error);
  }
};

const handleVerifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const email = await emailVerificationService.verifyToken(token);
    // TODO: 사용자 계정 활성화 로직 추가
    res.status(200).success({ email, code });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCheckEmailUnique,
  handleSendVerificationEmail,
  handleVerifyEmail,
};
