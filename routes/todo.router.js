// routes/todo.routes.js
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");
const authenticateMiddleware = require("../middleware/authenticate.jwt");

// Create Todo
router.post(
  "/",
  authenticateMiddleware.authenticateAccessToken,
  todoController.handleCreateTodo
);

// Get All Todos
router.get("/", todoController.handleGetAllTodos);

// Get Todo by ID
router.get("/:id", todoController.handleGetTodoById);

// Update Todo
router.put("/:id", todoController.handleUpdateTodo);

// Delete Todo
router.delete("/:id", todoController.handleDeleteTodo);

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
 *     summary: 새로운 Todo를 생성합니다.
 *     tags: [Todos]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "새로운 할 일 제목"
 *               status:
 *                 type: string
 *                 enum: ["pending", "in_progress", "completed"]
 *                 example: "pending"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               subtitle:
 *                 type: string
 *                 example: "할 일 부제목"
 *               content:
 *                 type: string
 *                 example: "할 일에 대한 상세 설명"
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3]
 *               studyrooms:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 4]
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
 *         description: 필수 필드 누락
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: 모든 Todo 목록을 조회합니다.
 *     tags: [Todos]
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
 *         description: 페이지 당 항목 수
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
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
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
 *                       example: "/todos?page=1"
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: 특정 Todo의 상세 정보를 조회합니다.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 Todo의 ID
 *     responses:
 *       200:
 *         description: Todo 상세 정보 조회 성공
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
 *   put:
 *     summary: 특정 Todo를 업데이트합니다.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 업데이트할 Todo의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "업데이트된 할 일 제목"
 *               description:
 *                 type: string
 *                 example: "업데이트된 할 일 설명"
 *               status:
 *                 type: string
 *                 enum: ["pending", "in_progress", "completed"]
 *                 example: "completed"
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 4]
 *               studyrooms:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 5]
 *     responses:
 *       200:
 *         description: Todo 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 잘못된 요청 데이터
 *       404:
 *         description: Todo를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   delete:
 *     summary: 특정 Todo를 삭제합니다.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 Todo의 ID
 *     responses:
 *       204:
 *         description: Todo 삭제 성공
 *       404:
 *         description: Todo를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
