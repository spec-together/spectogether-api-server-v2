const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiry.controller");
// TODO : 인증 미들웨어 가져와서 req.user 에 {user_id, name, nickname} 추가하기
const { authenticateAccessToken } = require("../middleware/authenticate.jwt"); // 인증 미들웨어 가져오기

router.get("/", authenticateAccessToken, inquiryController.handleGetInquiries); // ?page=1&limit=10

// 추가적인 엔드포인트 필요 시 주석 해제 및 구현
const multer = require("multer");
const path = require("path");

// TODO : 업로드 기능 분리하기
// TODO : 경로 없으면 생성하는 코드 추가
// TODO : 용량 제한 기능 추가
// 이미지 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/inquiries/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  authenticateAccessToken,
  upload.single("image"),
  inquiryController.handlePostInquiry
);

router.get(
  "/:id",
  authenticateAccessToken,
  inquiryController.handleGetInquiryById
);
// router.put('/:id', inquiryController.handlePutInquiry)
// router.delete('/:id', inquiryController.handleDeleteInquiry)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: 문의 관련 API 엔드포인트
 */

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: 문의 목록을 조회합니다.
 *     tags: [Inquiries]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 문의 수
 *     responses:
 *       200:
 *         description: 문의 목록을 성공적으로 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inquiry'
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 */

// 추가적인 엔드포인트 필요 시 주석 해제 및 구현
/**
 * @swagger
 * /inquiries:
 *   post:
 *     summary: 새로운 문의를 생성합니다.
 *     tags: [Inquiries]
 *     security:
 *       - AccessToken_Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateInquiry'
 *     responses:
 *       201:
 *         description: 문의가 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateInquiryResponse'
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: 특정 문의를 조회합니다.
 *     tags: [Inquiries]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의 ID
 *     responses:
 *       200:
 *         description: 문의 정보를 성공적으로 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetInquiryResponse'
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

/**
//  * @swagger
 * /inquiries/{id}:
 *   put:
 *     summary: 특정 문의를 업데이트합니다.
 *     tags: [Inquiries]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInquiry'
 *     responses:
 *       200:
 *         description: 문의가 성공적으로 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
// router.put('/:id', authenticateAccessToken, inquiryController.handlePutInquiry);

/**
//  * @swagger
 * /inquiries/{id}:
 *   delete:
 *     summary: 특정 문의를 삭제합니다.
 *     tags: [Inquiries]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의 ID
 *     responses:
 *       200:
 *         description: 문의가 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
// router.delete('/:id', authenticateAccessToken, inquiryController.handleDeleteInquiry);
