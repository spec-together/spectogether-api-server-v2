// encrypt.service.js

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const baseX = require("base-x").default;
const { SALT_ROUNDS, CIPHER_SECRET_KEY } = require("../config.json").SERVER;
const logger = require("../logger"); // Ensure correct path
const { NotAllowedError } = require("../errors");

// Base62 문자 집합 정의
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE62_ENCODER = baseX(BASE62);

// 암호화 알고리즘 설정
const ALGORITHM = "aes-256-cbc";

// CIPHER_SECRET_KEY 검증
if (!/^[0-9a-fA-F]{64}$/.test(CIPHER_SECRET_KEY)) {
  throw new Error(
    "CIPHER_SECRET_KEY must be a 64-character hexadecimal string."
  );
}

const key = Buffer.from(CIPHER_SECRET_KEY, "hex");

if (key.length !== 32) {
  throw new Error(
    "CIPHER_SECRET_KEY must be 32 bytes (64 hex characters) long."
  );
}

/**
 * 암호화 함수
 * @param {string} text - 암호화할 텍스트
 * @returns {string} - Base62 인코딩된 암호화된 데이터
 */
const encrypt62 = (text) => {
  try {
    if (typeof text === "number") {
      logger.fatal(
        `[encrypt62] int값을 암호화하려 시도했습니다. string으로 수정하는 것을 권고합니다. text: ${text}`
      );
      text = text.toString();
    }
    const iv = crypto.randomBytes(16); // 16바이트 IV 생성
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // IV와 암호문을 결합
    const combined = Buffer.concat([iv, encrypted]);

    // Base62 인코딩
    const base62 = BASE62_ENCODER.encode(combined);

    return base62;
  } catch (err) {
    logger.error(`암호화 오류: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

/**
 * 복호화 함수
 * @param {string} encryptedText - Base62 인코딩된 암호화된 데이터
 * @returns {string} - 복호화된 텍스트
 */
const decrypt62 = (encryptedText) => {
  try {
    // Base62 디코딩
    const combined = BASE62_ENCODER.decode(encryptedText);

    if (combined.length < 16) {
      throw new Error("암호문이 너무 짧습니다. 유효하지 않은 데이터입니다.");
    }

    // IV와 암호문 분리
    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (err) {
    logger.error(`복호화 오류: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

/**
 * 비밀번호 해싱 함수
 * @param {string} password - 해싱할 비밀번호
 * @returns {Promise<string>} - 해싱된 비밀번호
 */
const generateHashedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (err) {
    logger.error(`비밀번호 해싱 오류: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

/**
 * 비밀번호 비교 함수
 * @param {string} password - 입력된 비밀번호
 * @param {string} hashedPassword - 저장된 해싱된 비밀번호
 * @returns {Promise<boolean>} - 비밀번호 일치 여부
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const checkresult = await bcrypt.compare(password, hashedPassword);
    if (!checkresult) {
      throw new NotAllowedError("비밀번호가 일치하지 않습니다.");
    }
  } catch (err) {
    logger.error(`비밀번호 비교 오류: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

module.exports = {
  encrypt62,
  decrypt62,
  generateHashedPassword,
  comparePassword,
};
