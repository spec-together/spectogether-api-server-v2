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
