const jwt = require("jsonwebtoken");
const {
  generateHashedPassword,
  encrypt62,
} = require("../../services/encrypt.service");
const { JWT_SECRET } = require("../../config.json").SERVER;

generateHashedPassword("password").then((hashed) => console.log(hashed));

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

console.log(createRefreshTokenService(1));
console.log(createRefreshTokenService(2));
console.log(createRefreshTokenService(3));
console.log(createRefreshTokenService(4));
console.log(createRefreshTokenService(5));
console.log(createRefreshTokenService(6));
console.log(createRefreshTokenService(7));
console.log(createRefreshTokenService(8));
console.log(createRefreshTokenService(9));
console.log(createRefreshTokenService(10));
console.log(createRefreshTokenService(11));
console.log(createRefreshTokenService(12));
