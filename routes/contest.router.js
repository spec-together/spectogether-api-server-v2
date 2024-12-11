const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contest.controller.js");

router.get("/", contestController.getAllContests);
router.get("/:id", contestController.getContestById);
// router.post("/", contestController.createContest);
router.post("/", contestController.createContestWithAssociations);

// 추가적인 라우트 정의...

/**
 * @swagger
 * tags:
 *  name: Contests
 *  description: 공모전 관련 API 엔드포인트
 *
 * /contests:
 *  get:
 *   summary: 공모전 목록을 조회합니다.
 *   tags: [Contests]
 *   parameters:
 *    - in: query
 *      name: page
 *      schema:
 *       type: integer
 *       default: 1
 *      description: 페이지 번호
 *    - in: query
 *      name: limit
 *      schema:
 *       type: integer
 *       default: 10
 *      description: 페이지 당 항목 수
 *   responses:
 *    200:
 *     description: 공모전 목록 조회 성공
 *    400:
 *     description: 잘못된 요청
 *    500:
 *     description: 서버 오류
 *
 * /contests/{id}:
 *  get:
 *   summary: 특정 공모전의 상세 정보를 조회합니다.
 *   tags: [Contests]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: 조회할 공모전의 ID
 *   responses:
 *    200:
 *     description: 공모전 상세 정보 조회 성공
 *    404:
 *     description: 공모전 없음
 *    500:
 *     description: 서버 오류
 *
 */

// TODO: 공모전 생성 API 스펙 정의 ... ING ...
// post:
//  summary: 새로운 공모전을 생성합니다.
//  tags: [Contests]
//  requestBody:

module.exports = router;
