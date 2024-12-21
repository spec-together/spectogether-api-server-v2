// routes/todo.routes.js
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo/todo.controller");
const authenticateMiddleware = require("../middleware/authenticate.jwt");

// 로그인 사용자만 접근 가능
// TODO : 본인 여부, 참여자 여부 확인 기능 추가

// Create Todo
router.post(
  "/",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleCreateTodo
);

// Get All Todos
router.get(
  "/",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleGetAllTodos
);

// Get Todo by ID
router.get(
  "/:id",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleGetTodoById
);

// Update Todo
router.put(
  "/:id",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleUpdateTodo
);

// Delete Todo
router.delete(
  "/:id",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleDeleteTodo
);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo 관리 API
 */

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: 새로운 Todo를 생성합니다
 *     tags: [Todos]
 *     security:
 *       - AccessToken_Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deadline
 *               - title
 *               - subtitle
 *               - content
 *               - studyroom_id
 *             properties:
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               title:
 *                 type: string
 *                 example: "프로젝트 완료하기"
 *               subtitle:
 *                 type: string
 *                 example: "최종 제출"
 *               content:
 *                 type: string
 *                 example: "프로젝트 마무리 작업 진행"
 *               studyroom_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Todo 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 잘못된 입력값
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 스터디룸을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 *   get:
 *     summary: Todo 목록을 조회합니다
 *     tags: [Todos]
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
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: studyroom_id
 *         schema:
 *           type: integer
 *         description: 특정 스터디룸의 Todo만 조회하고 싶을 때 사용
 *     responses:
 *       200:
 *         description: Todo 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_items:
 *                       type: integer
 *                       example: 50
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       example: "/todos?page=2"
 *                     previous:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증이 필요합니다
 *       500:
 *         description: 서버 오류
 *
 * /todos/{id}:
 *   get:
 *     summary: 특정 Todo를 조회합니다
 *     tags: [Todos]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 Todo ID
 *     responses:
 *       200:
 *         description: Todo 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 *   put:
 *     summary: Todo를 수정합니다
 *     tags: [Todos]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - deadline
 *               - subtitle
 *               - content
 *               - studyroom_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: "수정된 Todo 제목"
 *               subtitle:
 *                 type: string
 *                 example: "수정된 Todo 부제목"
 *               content:
 *                 type: string
 *                 example: "수정된 Todo 내용"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: completed
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               studyroom_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Todo 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 잘못된 입력값
 *       404:
 *         description: Todo를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 *   delete:
 *     summary: Todo를 삭제합니다
 *     tags: [Todos]
 *     security:
 *       - AccessToken_Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 Todo ID
 *     responses:
 *       204:
 *         description: Todo 삭제 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: Todo 삭제 권한 없음
 *       404:
 *         description: Todo를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
