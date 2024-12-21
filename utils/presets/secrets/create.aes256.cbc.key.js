// 키 생성 예시 (한 번만 실행하여 키를 생성)
const crypto = require("crypto");

const generateKey = () => {
  return crypto.randomBytes(32).toString("hex"); // 32바이트 키를 16진수 문자열로 변환
};

console.log(generateKey());
