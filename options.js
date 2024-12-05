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

module.exports = {
  corsOptions,
  // sslOptions,
};
