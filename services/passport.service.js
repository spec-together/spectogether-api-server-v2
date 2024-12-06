const { InvalidInputError, KakaoUserNotRegisteredError } = require("../errors");
const logger = require("../logger");
const {
  getUserByUserId,
  getUserbyEmail,
} = require("../repositories/passport.repository");

const passportGetUserByUserIdService = async (userId) => {
  const user = await getUserByUserId(userId);
  if (!user) {
    logger.fatal(`[FATAL_SECURITY] JWT SECRET GOT LEAKED`);
    throw new InvalidInputError("HOW?");
  }
  const ret = {
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
  };
  return ret;
};

const passportGetUserByEmailService = async (email) => {
  const user = await getUserbyEmail(email);
  if (!user) {
    // throw new KakaoUserNotRegisteredError(
    //   "카카오로 로그인한 사용자는 회원가입이 되어 있지 않습니다.",
    //   {
    //     email,
    //   }
    // );
    return user;
  }
  const ret = {
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
  };
  return ret;
};

module.exports = {
  passportGetUserByUserIdService,
  passportGetUserByEmailService,
};
