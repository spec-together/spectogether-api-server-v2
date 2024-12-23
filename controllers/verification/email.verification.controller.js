const emailVerificationService = require("../../services/verification/email.verification.service.js");
const encryptUtil = require("../../utils/encrypt.util.js");

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id: verificationCodeId } =
      await emailVerificationService.sendVerification({ email });
    res.status(200).success({
      id: encryptUtil.encrypt62(verificationCodeId.toString()),
      message: "인증 메일이 발송되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    const verificationCodeId = encryptUtil.decrypt62(id);
    await emailVerificationService.verifyToken({
      id: verificationCodeId,
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
