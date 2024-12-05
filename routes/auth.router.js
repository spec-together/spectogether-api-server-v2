const express = require("express");
const router = express.Router();

const {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
} = require("../controllers/auth.controller");

// 회원가입
/**
 * @swagger
 * /users:
 *   post:
 *     summary: 새로운 사용자를 생성합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserSchema'
 *     responses:
 *       201:
 *         description: 사용자가 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserSchema'
 *       400:
 *         description: 잘못된 요청 데이터.
 *       500:
 *         description: 서버 오류
 */
router.get("/register", handleUserRegister);
// 로컬 로그인
router.get("/login/local", handleUserLocalLogin);
// OAuth2 : 카카오 로그인
router.get("/login/kakao", handleKakaoLogin);
router.get("/login/kakao/callback", handleKakaoCallback);
// 로그아웃
router.get("/logout", handleUserLogout);
// AT 재발급
router.get("/token/reissue", handleReissueAccessToken);

module.exports = router;
