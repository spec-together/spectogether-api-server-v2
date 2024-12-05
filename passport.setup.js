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

const logger = require("./logger");

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
      return done(null, jwt_payload, null);
    } catch (error) {
      logger.info(`[passport.setup] AccessToken Error : ${error}`);
      return done(error, false);
    }
  }
);

module.exports = {
  AccessTokenStrategy,
};
