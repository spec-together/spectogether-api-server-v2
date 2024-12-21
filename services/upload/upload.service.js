// services/upload.service.js
const path = require("node:path");
const fs = require("node:fs");
const multer = require("multer");

/**
 * 업로드 디렉토리의 존재 여부를 확인하고, 없을 경우 생성합니다.
 * @param {string} destination - 업로드 디렉토리 경로
 */
const ensureDirectoryExists = (destination) => {
  try {
    fs.readdirSync(destination);
  } catch (err) {
    console.error(
      `${destination} 폴더가 없어 ${destination} 폴더를 생성합니다.`
    );
    fs.mkdirSync(destination, { recursive: true });
  }
};

/**
 * 업로드 미들웨어를 생성하는 팩토리 함수
 * @param {string} destination - 업로드 디렉토리 경로
 * @returns {multer.Multer} - multer 미들웨어 인스턴스
 */
const createUploadMiddleware = (destination) => {
  // 디렉토리 존재 여부 확인 및 생성
  ensureDirectoryExists(destination);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  return upload;
};

module.exports = {
  createUploadMiddleware,
};
