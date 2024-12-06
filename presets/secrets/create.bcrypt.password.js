const jwt = require("jsonwebtoken");
const {
  generateHashedPassword,
  encrypt62,
} = require("../../services/encrypt.service");
const {
  createAccessTokenService,
} = require("../../services/auth.token.service");
const { JWT_SECRET } = require("../../config.json").SERVER;

// generateHashedPassword("password").then((hashed) => console.log(hashed));

const createRefreshTokenService = (user_id) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
  };
  const options = {
    expiresIn: "7d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);

  return result;
};

console.log(createAccessTokenService("1", "kw", "admin"));
