const express = require("express");
const phoneVerificationRouter = express.Router();

const phoneController = require("../controllers/verification/phone.verification.controller");
const schema = require("../utils/validators/verification/phone.verification.validators");
const validate = require("../middleware/validate");

phoneVerificationRouter.post(
  "/unique",
  validate(schema.checkPhoneUnique),
  phoneController.checkPhoneUnique
);
phoneVerificationRouter.post(
  "/send",
  validate(schema.sendTokenToPhone),
  phoneController.sendTokenToPhone
);
phoneVerificationRouter.post(
  "/verify",
  validate(schema.verifyToken),
  phoneController.verifyToken
);

module.exports = phoneVerificationRouter;
