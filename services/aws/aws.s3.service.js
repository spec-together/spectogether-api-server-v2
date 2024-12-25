const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("../../config.json");
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, REGION } = config.AWS.S3;
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

/**
 * Multer-S3 설정을 통한 이미지 업로드 미들웨어 생성 함수.
 * @returns {Middleware} Express용 multer 미들웨어.
 */
const uploadImageToS3 = () =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      // acl: "public-read", // 업로드된 파일의 접근 권한
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        cb(null, uniqueFileName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("허용되지 않은 파일 형식입니다."), false);
      }
    },
  });

const uploadImage = async (req, res) => {
  try {
    // multer 미들웨어를 사용하여 이미지 업로드 처리
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer 오류 처리
        logger.error("[uploadImage] Multer 오류:", err.message);
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // 일반 오류 처리
        logger.error("[uploadImage] 일반 오류:", err.message);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        throw new NotExistsError("업로드할 파일이 없습니다.");
      }
      const CLOUD_FRONT_URL = "https://d21sea418xedaj.cloudfront.net/";
      // 업로드된 파일의 키 추출
      const fileKey = req.file.key;

      // CloudFront URL과 파일 키를 결합하여 최종 이미지 URL 생성
      const imageUrl = `${CLOUD_FRONT_URL}${fileKey}`;
      // 업로드된 파일의 CloudFront URL 반환
      res.status(200).json({
        message: "이미지 업로드 성공",
        imageUrl: imageUrl,
      });
    });
  } catch (error) {
    logger.error(`[uploadImage] 이미지 업로드 실패: ${error.message}`);
    if (error instanceof NotExistsError) {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "서버 오류로 인해 이미지 업로드에 실패했습니다." });
  }
};

// Multer 미들웨어 초기화
const upload = s3Service.uploadImageToS3().single("spectogether_image");

module.exports = {
  s3Client,
  uploadImageToS3,
};
