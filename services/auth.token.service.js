const jwt = require("jsonwebtoken");
const { UserRefreshToken } = require("../models");
const { JWT_SECRET } = require("../config.json").SERVER;

const createAccessTokenService = (user_id, name, nickname) => {
  const payload = {
    user_id,
    name,
    nickname,
  };
  const options = {
    expiresIn: "30m",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

const createRefreshTokenService = async (user_id) => {
  const payload = {
    user_id,
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
  createRefreshTokenService,
};
