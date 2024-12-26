// services/upload.service.js
const path = require("node:path");
const fs = require("node:fs");

const multer = require("multer");
const multerS3 = require("multer-s3");

const config = require("../../config.json");
const {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  BUCKET_NAME,
  REGION,
  CLOUDFRONT_URL,
} = config.AWS.S3;
const { v4: uuidv4 } = require("uuid");

const { S3Client } = require("@aws-sdk/client-s3");
const { NotAllowedError } = require("../../errors");
const logger = require("../../logger");

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

/**
 * Multer-S3 설정을 통한 이미지 업로드 미들웨어 생성 함수.
 * @returns {Middleware} Express용 multer 미들웨어.
 */
const uploadImageToS3 = () => {
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      // acl: "public-read", // 업로드된 파일의 접근 권한
      metadata: (req, file, cb) => {
        logger.debug(
          `[uploadImageToS3] file: ${JSON.stringify(file, null, 2)}`
        );
        // const romanizedOriginalName = tossHangul.romanize(file.originalname);
        // const sanitizedOriginalName = romanizedOriginalName.replace(
        //   /[^a-zA-Z0-9_\-\.]/g,
        //   "-"
        // );

        // 도대체 왜 안되는지 모르겠음 ;;;;;;;;

        cb(null, {});
      },
      key: (req, file, cb) => {
        // 파일 확장자 추출
        const fileExtension = path.extname(file.originalname);
        // 파일명 중복을 방지하기 위한 UUID 생성
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        // const uniqueFileName = uuidv4();
        cb(null, uniqueFileName);
      },
    }),
    // 파일 크기 제한 (100MB)
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new NotAllowedError("허용되지 않은 파일 형식입니다."), false);
      }
    },
  });
};

const getCloudfrontUrl = (fileKey) => `${CLOUDFRONT_URL}/${fileKey}`;

module.exports = {
  createUploadMiddleware,
  uploadImageToS3,
  getCloudfrontUrl,
};
