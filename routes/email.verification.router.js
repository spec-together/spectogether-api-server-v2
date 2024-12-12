const express = require("express");
const emailVerificationController = require("../controllers/email.verification.controller.js");

const router = express.Router();

// POST /verification/email/unique
router.post("/unique", emailVerificationController.handleCheckEmailUnique);

// POST /verification/email/send
router.post("/send", emailVerificationController.handleSendVerificationEmail);

// POST /verification/email/verify
router.post("/verify", emailVerificationController.handleVerifyEmail);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Email Verification
 *   description: 이메일 인증 관련 API
 *
 * /verification/email/unique:
 *   post:
 *     summary: 이메일 중복 확인
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckEmailUnique'
 *     responses:
 *       200:
 *         description: 사용 가능한 이메일
 *       409:
 *         description: 이미 사용중인 이메일
 *       500:
 *         description: 서버 오류
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
 *             $ref: '#/components/schemas/SendVerification'
 *     responses:
 *       200:
 *         description: 인증 메일 발송됨
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
 *             $ref: '#/components/schemas/VerifyEmail'
 *     responses:
 *       200:
 *         description: 이메일 인증 성공
 *       400:
 *         description: 유효하지 않은 인증 코드
 *       500:
 *         description: 서버 오류
 */
