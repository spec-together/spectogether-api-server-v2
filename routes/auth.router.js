const express = require("express");
const router = express.Router();

const {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
  handleCreateTestUser,
  handleGetTerms,
} = require("../controllers/auth/auth.controller");
const passport = require("passport");

// TODO : 나중에 지워라 컨벤션 심각하게 위반하는거 ..
const {
  checkIfUserExistsByEmail,
  checkIfUserExistsByPhoneNumber,
} = require("../repositories/auth.repository");
const { AlreadyExistsError } = require("../errors");

// Route Definitions
router.get("/terms", handleGetTerms);
router.post("/register", handleUserRegister);
router.post("/register/test", handleCreateTestUser);
router.post("/login/local", handleUserLocalLogin);
router.get("/login/kakao", passport.authenticate("kakao", { session: false }));
router.get("/login/kakao/callback", handleKakaoCallback);
router.get("/logout", handleUserLogout);
router.get("/token/reissue", handleReissueAccessToken);
router.get("/teapot", (req, res) => res.status(418).send("I'm a teapot"));

router.post("/verification/email/unique", async (req, res, next) => {
  const { email } = req.body;
  const result = await checkIfUserExistsByEmail(email);
  if (result) next(new AlreadyExistsError("이미 존재하는 이메일입니다."));
  return res.status(200).success("사용 가능한 이메일입니다.");
});

router.post("/verification/phone/unique", async (req, res, next) => {
  const { phone_number } = req.body;
  const result = await checkIfUserExistsByPhoneNumber(phone_number);
  if (result) next(new AlreadyExistsError("이미 존재하는 전화번호입니다."));
  return res.status(200).success("사용 가능한 전화번호입니다.");
});

module.exports = router;

// Swagger Documentation - Auth Controller
/**
 * @swagger
 * tags:
 *   name: Auth Controller
 *   description: 인증 관련 API 엔드포인트
 *
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
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 *
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
 *
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
 *
 * /auth/login/kakao:
 *   get:
 *     summary: 카카오 로그인을 수행합니다.
 *     tags: [Auth Controller]
 *     responses:
 *       302:
 *         description: 카카오 인증 페이지로 리다이렉트
 *       500:
 *         description: 서버 오류
 *
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
 *
 * /auth/logout:
 *   get:
 *     summary: 로그아웃 API
 *     tags: [Auth Controller]
 *     security:
 *       - RefreshToken_Cookie: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *       401:
 *         description: 로그인 상태가 아님
 *       403:
 *         description: 유효하지 않은 토큰임
 *       404:
 *         description: 토큰은 유효하나, 저장되어 있는 토큰이 아님
 *       500:
 *         description: 서버 오류
 *
 * /auth/token/reissue:
 *   get:
 *     summary: Access Token 재발급 API
 *     tags: [Auth Controller]
 *     responses:
 *       201:
 *         description: AT 재발급 성공
 *       401:
 *         description: 로그인 상태가 아님
 *       403:
 *         description: 유효하지 않은 토큰임
 *       404:
 *         description: 토큰은 유효하나, 저장되어 있는 토큰이 아님
 *       500:
 *         description: 서버 오류
 *
 * /auth/teapot:
 *   get:
 *     summary: 테스트용 티팟 엔드포인트
 *     tags: [Auth Controller]
 *     responses:
 *       418:
 *         description: 재미있는 응답
 */
