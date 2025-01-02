const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.json").SERVER;
const { UnauthorizedError, NotAllowedError } = require("../errors");
const logger = require("../logger");
const { decrypt62 } = require("../utils/encrypt.util");

const chatService = require("../services/socket/studyroom.chat.socket.service");

/**
 * Bearer 토큰을 추출하고 검증하는 미들웨어
 */
const checkAccessToken = (socket, next) => {
  const authHeader =
    socket.handshake.auth.token || socket.request.headers.authorization;
  // const authHeader = socket.handshake.auth.token;
  logger.debug(`[checkAccessToken] Authorization Header: ${authHeader}`);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        logger.warn(`[checkAccessToken] 토큰 검증 실패: ${err.message}`);
        next(
          new NotAllowedError({
            message: "토큰이 유효하지 않습니다.",
            jwt_message: err.message,
          })
        );
        return;
      }
      const user_id = parseInt(decrypt62(user.user_id));
      const { name, nickname } =
        await chatService.getNameAndNicknameById(user_id);

      socket.user = {
        user_id,
        name,
        nickname,
      }; // 검증된 사용자 정보를 요청 객체에 추가
      logger.debug(
        `[checkAccessToken] 인증된 사용자: ${user_id} ${name} ${nickname}`
      );
      next();
    });
  } else {
    logger.error("[checkAccessToken] 인증 헤더가 누락되었습니다.");
    next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
  }
};

module.exports = {
  checkAccessToken,
};
