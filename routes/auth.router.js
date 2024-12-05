const express = require("express");
const router = express.Router();

const {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
  handleCreateTestUser,
} = require("../controllers/auth.controller");

// 회원가입
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 새로운 사용자를 생성합니다.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserSchema'
 *     responses:
 *       201:
 *         description: 사용자가 성공적으로 생성되었습니다.
 *       ELSE:
 *        description: 에러 객체를 참조하세요.
 */
router.post("/register", handleUserRegister);

/**
 * @swagger
 * /auth/register/test:
 *   post:
 *     summary: 테스트 유저를 생성합니다.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestUserSchema'
 *     responses:
 *       201:
 *         description: 테스트 유저 생성에 성공했습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/register/test", handleCreateTestUser);
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
