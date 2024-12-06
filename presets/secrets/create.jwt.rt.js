const {
  createAccessTokenService,
} = require("../../services/auth.token.service");
const { JWT_SECRET } = require("../../config.json").SERVER;
const jwt = require("jsonwebtoken");
const { encrypt62 } = require("../../services/encrypt.service");

// createAccessTokenService("1", "kw", "admin");

const createRefreshTokenWithoutWritingToDb = async (user_id) => {
  const payload = {
    user_id: encrypt62(user_id.toString()),
  };
  const options = {
    expiresIn: "7d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);

  return result;
};

console.log(createRefreshTokenWithoutWritingToDb(6));
