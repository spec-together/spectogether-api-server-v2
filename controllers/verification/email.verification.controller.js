const emailVerificationService = require("../../services/verification/email.verification.service.js");
const { encrypt62 } = require("../../utils/encrypt.util.js");

const handleCheckEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUnique = await emailVerificationService.isEmailUniqueService(email);
    if (isUnique) {
      return res
        .status(200)
        .success({ email, message: "사용 가능한 이메일입니다." });
    }
  } catch (error) {
    next(error);
  }
};

const handleSendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const code = await emailVerificationService.sendVerification(email);
    res
      .status(200)
      .success({ email, message: "인증 이메일이 발송되었습니다." });
  } catch (error) {
    next(error);
  }
};

const handleVerifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const verifiedEmail = await emailVerificationService.verifyToken(
      email,
      code
    );

    res.status(200).success({
      email_verification_code_id: encrypt62(
        verifiedEmail.email_verification_code_id
      ),
      message: "이메일 인증이 완료되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCheckEmailUnique,
  handleSendVerificationEmail,
  handleVerifyEmail,
};
