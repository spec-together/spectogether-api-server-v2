// const fs = require("fs");

const corsOptions = {
  origin: ["http://localhost:5173", "http://192.168.0.24:5173"], // CORS domain 설정
  credentials: true,
};

// SSL 인증서 로드
// const sslOptions = {
//   key: fs.readFileSync("localhost-key.pem"), // 개인 키 파일
//   cert: fs.readFileSync("localhost-cert.pem"), // 인증서 파일
// };

const refreshTokenCookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const logoutCookieOptions = {
  maxAge: 0,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

module.exports = {
  corsOptions,
  // sslOptions,
  refreshTokenCookieOptions,
  logoutCookieOptions,
};
