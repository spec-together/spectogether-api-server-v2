const emailVerificationService = require("../../services/verification/email.verification.service.js");

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id } = await emailVerificationService.sendVerification({ email });
    res.status(200).success({
      id,
      message: "인증 메일이 발송되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    await emailVerificationService.verifyToken({
      id,
      code,
    });
    res.status(200).success({ message: "이메일 인증이 완료되었습니다." }); // res.status(200).success(null)
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
};
