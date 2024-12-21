const {
  createAccessTokenService,
  createTestUserTokenService,
} = require("../../../services/auth/auth.token.service");

const { JWT_SECRET } = require("../../../config.json").SERVER;
const jwt = require("jsonwebtoken");
const { encrypt62 } = require("../../encrypt.util");

// createAccessTokenService("1", "kw", "admin");
const createBearerToken = (user_id) => {
  const at = createTestUserTokenService(user_id, "kw2", "admin2");
  return `Bearer ${at}`;
};

console.log(createBearerToken(1));

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

// console.log(createRefreshTokenWithoutWritingToDb(6));
