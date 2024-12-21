const passport = require("passport");
const axios = require("axios");
const bcrypt = require("bcrypt");

// Local Strategy
const LocalStrategy = require("passport-local").Strategy;
// JWT Strategy
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// OAuth2.0 Strategy
const KakaoStrategy = require("passport-oauth2").Strategy;

const { JWT_SECRET } = require("./config.json").SERVER;
const { KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET } =
  require("./config.json").KAKAO;

const logger = require("./logger");
const {
  passportGetUserByUserIdService,
  passportGetUserByEmailService,
} = require("./services/passport.service");
const { saveKakaoUserInfoService } = require("./services/auth.service");
const { decrypt62 } = require("./services/encrypt.service");

// 샘플 삼아 추가한 쿠키에서 JWT를 파싱하는 전략입니다.
const parseJwtFromCookie = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req.cookies) {
        // TODO : 서비스에서 사용하는 쿠키 이름에 맞게 변경하셔야 합니다.
        token = req.cookies.REFRESH_TOKEN;
        logger.info(`[passport.setup] cookie, Refresh JWT : ${!!token}`);
      }
      return token;
    },
  ]),
  secretOrKey: JWT_SECRET, // 비밀 키 설정
};

const parseBearerJwtFromHeader = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      logger.info(`[passport.setup] header, Bearer JWT : ${!!token}`);
      return token;
    },
  ]),
  secretOrKey: JWT_SECRET, // 비밀 키 설정
};

// Strategy 선언 : Bearer JWT에 담겨오는 AccessToken을 파싱하여 인증하는 전략입니다.
const AccessTokenStrategy = new JWTStrategy(
  parseBearerJwtFromHeader,
  async (jwt_payload, done) => {
    logger.info(
      `[passport.setup] JWT Payload : ${JSON.stringify(jwt_payload, null, 2)}`
    );
    try {
      // Payload를 바탕으로 사용자 정보를 가져와서, 넘길 필요가 있습니다.
      // done(error, user, info) 입니다. error가 null이 아니면 인증 실패로 간주됩니다.
      const paylaodUserIdDecrypted = decrypt62(jwt_payload.user_id);
      const userInfoByToken = passportGetUserByUserIdService(
        paylaodUserIdDecrypted
      );
      return done(null, userInfoByToken, null);
    } catch (error) {
      logger.error(
        `[passport.setup : AT Strategy]\
      \nNAME ${error.name} \
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
      );
      return done(error, false);
    }
  }
);

const KakaoOAuthStrategy = new KakaoStrategy(
  {
    authorizationURL: "https://kauth.kakao.com/oauth/authorize",
    tokenURL: "https://kauth.kakao.com/oauth/token",
    clientID: KAKAO_REST_API_KEY, // 카카오 앱 키
    callbackURL: "/auth/login/kakao/callback", // 설정한 Redirect URI
    clientSecret: KAKAO_CLIENT_SECRET, // 카카오 앱 시크릿
    scope: ["profile_nickname", "profile_image", "account_email", "openid"],
  },
  async (accessToken, refreshToken, params, profile, done) => {
    try {
      logger.info(
        `[passport.setup : kakao] params ${JSON.stringify(params, null, 2)}`
      );
      const userProfileResponseFromKakao = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const kakaoUserProfile = userProfileResponseFromKakao.data;
      logger.info(
        `[passport.setup : kakao] 카카오 사용자 정보 : ${JSON.stringify(kakaoUserProfile, null, 2)}`
      );

      const kakaoUserProfileParsed = {
        kakao_id: kakaoUserProfile.id,
        kakao_id_token: params.id_token,
        nickname: kakaoUserProfile.kakao_account.profile.nickname,
        profile_image_url:
          kakaoUserProfile.kakao_account.profile.profile_image_url,
        email: kakaoUserProfile.kakao_account.email,
      };
      // TODO : user_oauth에 저장하는 로직에 대해서 생각해보아야 합니다.
      // register 당시에 저장을 해야 하는데, 사용자가 주는 정보는 믿을 수 없으므로
      // temp db에 잠시 담아두고 동일하게 인증하는 방식으로 진행해야 함.
      await saveKakaoUserInfoService(kakaoUserProfileParsed);

      const user = await passportGetUserByEmailService(
        kakaoUserProfileParsed.email
      );
      if (!user) {
        return done(null, false, {
          message: "가입되어 있지 않은 사용자입니다.",
          user: kakaoUserProfileParsed,
        });
      } else {
        const userInfo = { ...kakaoUserProfileParsed, ...user };
        logger.info(
          `[passport.setup] 카카오계정 이메일에 일치하는 사용자가 존재합니다, 다음 정보를 전달합니다 :\
          \n${JSON.stringify(userInfo, null, 2)}`
        );
        return done(null, userInfo);
      }
    } catch (error) {
      logger.error(
        `[passport.setup : kakao]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
      );
      return done(error, null);
    }
  }
);

module.exports = {
  AccessTokenStrategy,
  KakaoOAuthStrategy,
};
