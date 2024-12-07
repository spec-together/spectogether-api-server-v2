const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.json").SERVER;
const { UnauthorizedError, NotAllowedError } = require("../errors");
const logger = require("../logger");
const { decrypt62 } = require("../services/encrypt.service");

/**
 * Bearer 토큰을 추출하고 검증하는 미들웨어
 */
const socketAuthenticateAccessToken = (socket, next) => {
  const authHeader = socket.request.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn(
          `[socketAuthenticateAccessToken] 토큰 검증 실패: ${err.message}`
        );
        next(
          new NotAllowedError({
            message: "토큰이 유효하지 않습니다.",
            jwt_message: err.message,
          })
        );
        return;
      }

      let { user_id, name, nickname } = user;
      user_id = parseInt(decrypt62(user_id));

      socket.user = {
        user_id,
        name,
        nickname,
      }; // 검증된 사용자 정보를 요청 객체에 추가
      logger.debug(
        `[socketAuthenticateAccessToken] 인증된 사용자: ${user_id} ${name} ${nickname}`
      );
      next();
    });
  } else {
    logger.error("[socketAuthenticateAccessToken] 인증 헤더가 누락되었습니다.");
    next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
  }
};

module.exports = {
  socketAuthenticateAccessToken,
};
