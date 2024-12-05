// base-x 패키지 설치 필요
// 터미널에서 다음 명령어를 실행하세요:
// npm install base-x

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const baseX = require("base-x").default;
const { SALT_ROUNDS, CIPHER_SECRET_KEY } = require("../config.json");

// Base62 문자 집합 정의
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE62_ENCODER = baseX(BASE62);

// 암호화 함수
const encrypt62 = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(CIPHER_SECRET_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // IV와 암호문을 결합
  const combined = Buffer.concat([iv, encrypted]);

  // Base62 인코딩
  const base62 = BASE62_ENCODER.encode(combined);

  return base62;
};

// 복호화 함수
const decrypt62 = (encryptedText) => {
  // Base62 디코딩
  const combined = BASE62_ENCODER.decode(encryptedText);

  // IV와 암호문 분리
  const iv = combined.slice(0, 16);
  const encrypted = combined.slice(16);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(CIPHER_SECRET_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
};

const generateeHashedPassword = async (password) => {
  const bcryptSalt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, bcryptSalt);

  return hashedPassword;
};

// async이나 어차피 promise를 반환하기에
const comparePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

module.exports = {
  encrypt62,
  decrypt62,
  generateeHashedPassword,
  comparePassword,
};
