const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiry.controller");
// TODO : 인증 미들웨어 가져와서 req.user 에 {user_id, name, nickname} 추가하기

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: 문의 목록 조회
 *     tags: [Inquiries]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 현재 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, answered, closed]
 *         description: 문의 상태로 필터링
 *     security:
 *       - AccessToken_Bearer: []
 *     responses:
 *       200:
 *         description: 성공적으로 문의 목록을 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inquiry'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultErrorResponseSchema'
 */
router.get("/", inquiryController.handleGetInquiries); // ?page=1&limit=10

// 추가적인 엔드포인트 필요 시 주석 해제 및 구현
// router.get(':id', inquiryController.handleGetInquiryById)
// router.post('/', inquiryController.handlePostInquiry)
// router.put('/:id', inquiryController.handlePutInquiry)
// router.delete('/:id', inquiryController.handleDeleteInquiry)

module.exports = router;
