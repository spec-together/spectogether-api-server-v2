const jwt = require("jsonwebtoken");
const { UserRefreshToken } = require("../../models");
const { encrypt62 } = require("../../utils/encrypt.util");
const { JWT_SECRET } = require("../../config.json").SERVER;

const createAccessTokenService = (user_id, name, nickname) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
    name,
    nickname,
  };
  const options = {
    expiresIn: "30m",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

const createTestUserTokenService = (user_id, name, nickname) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
    name,
    nickname,
  };
  const options = {
    expiresIn: "1y",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

const createRefreshTokenService = async (user_id) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
  };
  const options = {
    expiresIn: "7d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);

  await UserRefreshToken.create({
    user_id,
    refresh_token: result,
  });

  return result;
};

module.exports = {
  createAccessTokenService,
  createTestUserTokenService,
  createRefreshTokenService,
};
