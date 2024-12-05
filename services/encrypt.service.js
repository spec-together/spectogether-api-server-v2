const crypto = require("crypto");
const bcrypt = require("bcrypt");

// 암호화 함수
function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// 복호화 함수
function decrypt(encryptedText, secretKey) {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encrypted = textParts.join(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// 사용 예시
console.time("Generate Secret Key");
const secretKey = crypto.randomBytes(32).toString("hex"); // 256비트 키
console.timeEnd("Generate Secret Key");

console.time("Set Original Text");
const originalText = "암호화할 텍스트입니다.";
console.timeEnd("Set Original Text");

console.time("Encrypt Text");
const encrypted = encrypt(originalText, secretKey);
console.timeEnd("Encrypt Text");
console.log("Encrypted:", encrypted);

console.time("Decrypt Text");
const decrypted = decrypt(encrypted, secretKey);
console.timeEnd("Decrypt Text");
console.log("Decrypted:", decrypted);
