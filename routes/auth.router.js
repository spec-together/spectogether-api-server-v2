const express = require("express");
const router = express.Router();

const {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
  handleCreateTestUser,
  handleKakaoPassportCallback,
} = require("../controllers/auth.controller");
const passport = require("passport");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 새로운 사용자를 생성합니다.
 *     tags: [Auth Controller]
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
 *     tags: [Auth Controller]
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

/**
 * @swagger
 * /auth/login/local:
 *   post:
 *     summary: 로컬 로그인을 수행합니다.
 *     tags: [Auth Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserSchema'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       400:
 *         description: 잘못된 요청 데이터
 *       403:
 *         description: 비밀번호 일치하지 않음
 *       404:
 *         description: 존재하지 않는 사용자에 대한 로그인 시도
 *       500:
 *         description: 서버 오류
 */
router.post("/login/local", handleUserLocalLogin);

/**
 * @swagger
 * /auth/login/kakao:
 *   get:
 *     summary: 카카오 로그인을 수행합니다.
 *     tags: [Auth Controller]
 */
router.get("/login/kakao", passport.authenticate("kakao", { session: false }));

/**
 * @swagger
 * /auth/login/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백을 수행합니다.
 *     tags: [Auth Controller]
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       202:
 *         description: 가입되지 않은 사용자
 *       500:
 *         description: 서버 오류
 *       503:
 *         description: 연결된 서비스 오류
 */
router.get("/login/kakao/callback", handleKakaoCallback);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃 API
 *     tags: [Auth Controller]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.get("/logout", handleUserLogout);
// AT 재발급
router.get("/token/reissue", handleReissueAccessToken);

router.get("/teapot", (req, res) => res.status(418).send("I'm a teapot"));

module.exports = router;
