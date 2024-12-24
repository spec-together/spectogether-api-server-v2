const logger = require("../../logger");
const phoneVerificationService = require("../../services/verification/phone.verification.service");
const { logError } = require("../../utils/handlers/error.logger");

const checkPhoneUnique = async (req, res, next) => {
  //
  try {
    const { phone_number } = req.body;
    const result =
      await phoneVerificationService.checkPhoneUnique(phone_number);
    if (result) return res.status(200).success("사용 가능한 전화번호입니다.");
  } catch (error) {
    logError(error);
    next(error);
  }
};
const sendTokenToPhone = async (req, res, next) => {
  //
  try {
    const { phone_number } = req.body;
    const encryptedId =
      await phoneVerificationService.sendTokenToPhone(phone_number);
    return res.status(200).success({
      id: encryptedId,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
const verifyToken = async (req, res, next) => {
  //
  try {
    const { id, token } = req.body;
    await phoneVerificationService.verifyToken(id, token);
    return res.status(200).success("인증에 성공했습니다.");
  } catch (error) {
    logError(error);
    next(error);
  }
};

module.exports = {
  checkPhoneUnique,
  sendTokenToPhone,
  verifyToken,
};
