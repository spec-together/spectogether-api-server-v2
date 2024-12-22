const express = require("express");
const emailVerificationController = require("../controllers/verification/email.verification.controller.js");
const emailVerificationValidator = require("../utils/validators/email.verification.validators.js");
const validate = require("../middleware/validate.js");

const router = express.Router();

// POST /verification/email/send
router.post(
  "/send",
  validate(emailVerificationValidator.validateSendVerificationEmail),
  emailVerificationController.sendVerificationEmail
);

// POST /verification/email/verify
router.post(
  "/verify",
  validate(emailVerificationValidator.validateVerifyEmail),
  emailVerificationController.verifyEmail
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Email Verification
 *   description: 이메일 인증 관련 API
 *
 * /verification/email/send:
 *   post:
 *     summary: 인증 코드 이메일 발송
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendVerificationEmailRequest'
 *     responses:
 *       200:
 *         description: 인증 메일 발송됨, 인증 코드 ID 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendVerificationResponse'
 *       500:
 *         description: 서버 오류
 *
 * /verification/email/verify:
 *   post:
 *     summary: 이메일 인증 코드 확인
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: 이메일 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyEmailResponse'
 *       400:
 *         description: 유효하지 않은 인증 코드
 *       500:
 *         description: 서버 오류
 */
