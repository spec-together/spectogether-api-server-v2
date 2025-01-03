const logger = require("../../logger");
const { refreshTokenCookieOptions } = require("../../options");
const loginService = require("../../services/auth/login.auth.service");
const tokenService = require("../../services/auth/auth.token.service");
const { encrypt62 } = require("../../utils/encrypt.util");

const { logError } = require("../../utils/handlers/error.logger");
const registerService = require("../../services/auth/register.auth.service");

const localLogin = async (req, res, next) => {
  try {
    // 1. 미들웨어에서 데이터 검증
    // 2. 해당 사용자 존재여부 확인 (전화번호로)
    const data = await loginService.getUserPasswordByPhoneNumber(
      req.body.login_id
    );
    // 3. 비밀번호 확인
    await loginService.comparePassword({
      password: req.body.password,
      hashed_password: data.password,
    });

    // 4. JWT 토큰 발급
    // 4-1. access token 생성
    const accessToken = tokenService.createAccessToken({
      user_id: data.user_id,
      name: data.name,
      nickname: data.nickname,
    });
    // 4-2. refresh token 생성
    const refreshToken = await tokenService.createRefreshToken(data.user_id);

    logger.debug(
      `[localLogin] 토큰 발급 완료\
      \nAT : ${accessToken}\
      \nRT : ${refreshToken}`
    );

    const ret = {
      user_id: encrypt62(data.user_id),
      name: data.name,
      nickname: data.nickname,
    };

    logger.debug(`[localLogin] 응답 데이터: ${JSON.stringify(ret, null, 2)}`);

    // 5. 응답
    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        user: ret,
        access_token: accessToken,
      });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // 1. RT가 DB에 존재하는지 확인하고, 존재한다면 DB에서 제거
    // 1-1. DB에 존재하지 않으면 에러 로깅
    const refreshToken = req.cookies.SPECTOGETHER_RT;
    const isTokenExist = tokenService.checkIfRefreshTokenExists(refreshToken);
    // 1-2. DB에서 제거
    if (isTokenExist) await loginService.deleteRefreshToken(refreshToken);

    // 2. 응답
    return res.status(200).clearCookie("SPECTOGETHER_RT").success({
      message: "로그아웃 되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const reissueAccessToken = async (req, res, next) => {
  try {
    // 1. RT가 유효한지 확인
    const refreshToken = req.cookies.SPECTOGETHER_RT;
    tokenService.checkIfRefreshTokenExists(refreshToken);
    // 2. user_id 기반으로 AT 재발급
    const decodedToken = await tokenService.isRefreshTokenValid(refreshToken);
    const data = await loginService.getUserInfoByEncryptedUserId(
      decodedToken.user_id
    );
    const accessToken = tokenService.createAccessToken({
      user_id: data.user_id,
      name: data.name,
      nickname: data.nickname,
    });

    // 3. 응답
    return res.status(200).success({
      access_token: accessToken,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // 1. 들어온 입력 검증
    // 2. 해당 세션의 전화번호 찾기
    const phone = await registerService.getPhoneNumberByVerificationId(
      req.body.phone_verification_session_id
    );
    // 3. 해당 전화번호를 가진 사용자의 비밀번호 변경
    const data = await loginService.setPassword({
      phone: phone,
      newPassword: req.body.new_password,
    });

    // 4. 응답
    return res.status(200).success({
      message: "비밀번호가 초기화되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    // 1. 들어온 입력 검증
    // 2. 해당 세션의 전화번호 찾기
    const phone = await registerService.getPhoneNumberByVerificationId(
      req.body.phone_verification_session_id
    );
    // 3. 기존 비밀번호가 일치하는지 확인
    const oldData = await loginService.getUserPasswordByPhoneNumber(phone);
    await loginService.comparePassword({
      password: req.body.old_password,
      hashed_password: oldData.password,
    });
    // 4. 일치하면 새로운 비밀번호로 변경
    await loginService.setPassword({
      phone: phone,
      newPassword: req.body.new_password,
    });

    // 4. 응답
    return res.status(200).success({
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

module.exports = {
  localLogin,
  logout,
  reissueAccessToken,
  resetPassword,
  changePassword,
};
