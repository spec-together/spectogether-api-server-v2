const {
  createTestUserService,
  validateRegisterInputService,
  checkDuplicateUserService,
  createNewUserService,
  createCalendarForNewUserService,
  validateLoginInputService,
  getUserInfoService,
  checkIfTokenIsValidService,
  removeRefreshTokenFromDatabaseByTokenStringService,
  checkIfRefreshTokenExistsByTokenStringService,
  checkAndReturnRefreshTokenIfExistsInRequestCookie,
  getEmailByEmailVerificationIdService,
  createUserAgreedTermsToDatabaseService,
  getCurrentTermsService,
} = require("../services/auth.service");
const logger = require("../logger");
const { RelatedServiceUnavailableError } = require("../errors");
const {
  decrypt62,
  comparePassword,
  encrypt62,
} = require("../services/encrypt.service");
const {
  getEmailByEmailVerificationId,
} = require("../repositories/auth.repository");
const {
  createAccessTokenService,
  createRefreshTokenService,
} = require("../services/auth.token.service");
const {
  refreshTokenCookieOptions,
  logoutCookieOptions,
} = require("../options");
const passport = require("passport");
const { FRONTEND_URL } = require("../config.json").SERVER;

const handleUserRegister = async (req, res, next) => {
  /*
  1. 데이터 검증, 카카오로 회원가입 시에는 user_oauth에도 집어넣기
  2. 이미 존재하는 사용자인지 확인 ( key = email )
  3. email verification id에 등록된 email과 일치하는지 확인
  4. spec_level, manner_level, role, is_active 는 default로 생성
  4-1. user_terms 에 연결
  5. calendar 생성, user_calendar 연결
  6. todo는 나중에 테이블에 쿼리 떄릴거임
  */
  try {
    const newUserData = req.body;
    // 데이터 검증
    logger.debug(`[handleUserRegister] 데이터 검증`);
    validateRegisterInputService(newUserData);
    // 카카오 회원가입일 경우에 user_oauth에 데이터 추가하기
    if (newUserData.user_register_type === "kakao") {
      // TODO : 카카오 회원가입일 경우에 user_oauth에 데이터 추가하기
    }

    // 중복 사용자 확인
    logger.debug(`[handleUserRegister] 중복 사용자 확인`);
    await checkDuplicateUserService(
      newUserData.email,
      newUserData.phone_number
    );
    // email verification id 확인
    // TODO : 편리성을 위해서 우선 비활성화 ... 추후에 핸드폰 번호 인증과 함께 활성화 필요

    // logger.debug(`[handleUserRegister] email verification id 확인`);
    // const emailVerifyId = decrypt62(newUserData.email_verification_id);
    // await getEmailByEmailVerificationIdService(emailVerifyId);

    // 사용자 생성
    logger.debug(`[handleUserRegister] 사용자 생성`);
    const newUser = await createNewUserService(newUserData);

    // user_terms 연결
    // TODO : 모든 약관에 대한 동의여부를 보냈는지 확인하기
    await createUserAgreedTermsToDatabaseService(
      newUser.user_id,
      newUserData.terms
    );

    // 캘린더 생성 및 user_calendar에 연결
    logger.debug(`[handleUserRegister] 캘린더 생성 및 user_calendar에 연결`);
    await createCalendarForNewUserService(newUser.user_id);

    return res.status(201).success({
      message: "사용자 생성에 성공했습니다.",
    });
  } catch (error) {
    logger.error(
      `[handleUserRegister]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

// 테스트 유저 생성을 위한 API 입니다, 실제 서비스에서는 사용되지 않습니다.
// 각종 검증 과정을 생략하고 유저를 바로 생성해줍니다.
const handleCreateTestUser = async (req, res, next) => {
  try {
    const { name, email, phone_number } = req.body;
    const newUser = await createTestUserService(name, email, phone_number);
    res.status(201).success({
      created_user: newUser,
      message: "테스트 유저 생성에 성공했습니다.",
    });
  } catch (error) {
    logger.error(
      `[handleCreateTestUser]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

const handleUserLocalLogin = async (req, res, next) => {
  /*
  1. 데이터 검증
  2. 전화번호로 사용자 DB에서 조회
  3. 사용자가 존재하지 않으면 404 반환
  4. 사용자가 존재하면 비밀번호 확인 - 틀리면 401 반환
  5. JWT 토큰 발급
  */
  try {
    // 데이터 검증
    const reqBody = req.body;
    const { login_id, password } = reqBody;
    validateLoginInputService(reqBody);

    // 사용자 조회 후 사용자 정보 받아오기
    logger.debug(`[handleUserLocalLogin] 사용자 조회`);
    const user = await getUserInfoService(login_id);
    await comparePassword(password, user.password);

    // JWT 토큰 발급
    const { user_id, name, nickname } = user;
    const accessToken = createAccessTokenService(user_id, name, nickname);
    const refreshToken = await createRefreshTokenService(user_id);
    logger.debug(
      `[handleUserLocalLogin] 토큰 발급 완료\
      \nAT : ${accessToken}\
      \nRT : ${refreshToken}`
    );
    const encryptedUserId = encrypt62(user_id);

    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        user: { user_id: encryptedUserId, name, nickname },
        access_token: accessToken,
      });
  } catch (error) {
    logger.error(
      `[handleUserLocalLogin]\
      \nNAME ${error.name} \
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

const handleKakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { session: false }, (err, user, info) => {
    handleKakaoPassportCallback(err, user, info, req, res, next);
  })(req, res, next);
};

const handleKakaoPassportCallback = async (err, user, info, req, res, next) => {
  try {
    // 이건 진짜 에러 났을 때
    if (err) {
      logger.error(`[handleKakaoCallback 1] Error: ${err.message}`, {
        stack: err.stack,
      });
      throw err;
    }

    // 회원가입된 사용자가 아닐 떄
    if (!user) {
      const email = info?.user?.email;
      if (!email) {
        logger.error(
          `[handleKakaoCallback 2] 카카오 서버에서 받아온 정보가 올바르지 않습니다. ${JSON.stringify(info, null, 2)}`
        );
        throw new RelatedServiceUnavailableError({
          info,
          message: "카카오 서버에서 받아온 정보가 올바르지 않습니다.",
        });
      }

      logger.info(
        `[handleKakaoCallback 2-1] 가입되어 있지 않은 사용자입니다. info : ${JSON.stringify(info, null, 2)}`
      );
      return res.status(202).send(`
          <script>
            window.opener.postMessage({ not_registered_user: ${JSON.stringify({ email })} }, '${FRONTEND_URL}');
            window.close();
          </script>
        `);
    }
    logger.debug(
      `[handleKakaoCallback 3] 217' User : ${JSON.stringify(user, null, 2)}`
    );
    const { user_id, name, nickname } = user;
    const accessToken = createAccessTokenService(user_id, name, nickname);
    const refreshToken = await createRefreshTokenService(user_id);
    const encryptedUserId = encrypt62(user_id);

    logger.info(
      `[handleKakaoCallback 3-1] 로그인된 사용자 : ${JSON.stringify(user, null, 2)}`
    );

    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", refreshToken, refreshTokenCookieOptions).send(`
          <script>
            window.opener.postMessage(${JSON.stringify({ token: accessToken, user_id: encryptedUserId, name, nickname })}, '${FRONTEND_URL}');
            window.close();
          </script>
        `);
  } catch (error) {
    logger.error(`[handleKakaoCallback 4] Error: ${error.message}`, {
      stack: error.stack,
    });
    // throw error;
    next(error);
  }
};

const handleUserLogout = async (req, res, next) => {
  // FE에서 AT는 직접 지워야 합니다.
  try {
    const refreshToken = checkAndReturnRefreshTokenIfExistsInRequestCookie(req);
    checkIfTokenIsValidService(refreshToken);
    // const { user_id } = isTokenValid.decoded;
    // DB에 저장된 RT 삭제
    await removeRefreshTokenFromDatabaseByTokenStringService(refreshToken);

    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", "", logoutCookieOptions)
      .success({ message: "로그아웃 되었습니다." });
  } catch (error) {
    logger.error(
      `[handleUserLogout]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

const handleReissueAccessToken = async (req, res, next) => {
  /*
  1. RT가 유효한지 확인
  2. AT 재발급
  */
  try {
    const refreshToken = checkAndReturnRefreshTokenIfExistsInRequestCookie(req);
    const isTokenValid = checkIfTokenIsValidService(refreshToken);
    await checkIfRefreshTokenExistsByTokenStringService(refreshToken);
    const { user_id, name, nickname } = isTokenValid.decoded;
    const newAccessToken = createAccessTokenService(user_id, name, nickname);

    return res.status(201).success({ access_token: newAccessToken });
  } catch (error) {
    logger.error(
      `[handleReissueAccessToken]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

const handleGetTerms = async (req, res, next) => {
  try {
    // TODO : 약관들을 가져오는 로직
    const result = await getCurrentTermsService();
    logger.debug(
      `[handleGetTerms] 약관들을 가져왔습니다 : ${JSON.stringify(result, null, 2)}`
    );
    return res.status(200).success(result);
  } catch (error) {
    logger.error(
      `[handleGetTerms]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

module.exports = {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
  handleCreateTestUser,
  handleKakaoPassportCallback,
  handleGetTerms,
};
