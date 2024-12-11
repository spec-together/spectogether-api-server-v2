const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiry.controller");
const uploadController = require("../controllers/upload.controller");
const { authenticateAccessToken } = require("../middleware/authenticate.jwt");

// TODO : 사용하지 않는 반환값은 제거하기

const inquiryUploadPath = "uploads/inquiries/";

router.get("/", authenticateAccessToken, inquiryController.handleGetInquiries);
router.post(
  "/",
  authenticateAccessToken,
  uploadController.handleUpload(inquiryUploadPath),
  inquiryController.handlePostInquiry
);
router.get(
  "/:id",
  authenticateAccessToken,
  inquiryController.handleGetInquiryById
);
router.put(
  "/:id",
  authenticateAccessToken,
  uploadController.handleUpload(inquiryUploadPath),
  inquiryController.handlePutInquiry
);

router.delete(
  "/:id",
  authenticateAccessToken,
  inquiryController.handleDeleteInquiry
);

module.exports = router;
// Swagger Documentation - Inquiries Controller
/**
 * @swagger
 * tags:
 *   name: Inquiries Controller
 *   description: 문의 관련 API 엔드포인트
 *
 * /inquiries:
 *   get:
 *     summary: 문의 목록을 조회합니다.
 *     tags: [Inquiries Controller]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 문의 상태 필터링
 *     responses:
 *       200:
 *         description: 문의 목록을 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getAllInquiriesResponseSchema'
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *
 * /inquiries/{id}:
 *   get:
 *     summary: 특정 문의를 조회합니다.
 *     tags: [Inquiries Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 문의의 ID
 *     responses:
 *       200:
 *         description: 문의를 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getInquiryResponseSchema'
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *
 *   put:
 *     summary: 특정 문의를 수정합니다.
 *     tags: [Inquiries Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 문의의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/updateInquiryRequest'
 *     responses:
 *       200:
 *         description: 문의가 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/updateInquiryResponseSchema'
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *
 *   delete:
 *     summary: 문의를 삭제합니다.
 *     tags: [Inquiries Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 문의의 ID
 *     responses:
 *       200:
 *         description: 문의가 성공적으로 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/deleteInquiryResponseSchema'
 *       401:
 *         description: 인증이 필요합니다.
 *       404:
 *         description: 문의를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
