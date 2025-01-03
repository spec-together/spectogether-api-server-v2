const express = require("express");

const userController = require("../controllers/users/users.controller");
const patchUserController = require("../controllers/users/patch.users.controller");
const profileUserController = require("../controllers/users/profile.users.controller");
const todoController = require("../controllers/users/todo.users.controller");
const studyroomController = require("../controllers/users/studyroom.users.controller");

const { authenticateAccessToken } = require("../middleware/authenticate.jwt");
const router = express.Router();

// 사용자가 동의한 약관 가져오기
router.get(
  "/terms",
  authenticateAccessToken,
  userController.handleGetUsersAgreedTerm
);

// STUDYROOM

// 사용자 스터디룸 가져오기
router.get(
  "/studyrooms",
  authenticateAccessToken,
  studyroomController.handleGetUserStudyrooms
);

// TODO

// todo 가져오기
router.get(
  "/todos",
  authenticateAccessToken,
  todoController.handleGetUserTodos
);
router.get(
  "/todos/:todo_id",
  authenticateAccessToken,
  todoController.handleGetTodoInfo
);

// PROFILE

// 사용자 스펙 가져오기
router.get(
  "/specs",
  authenticateAccessToken,
  profileUserController.handleGetUserSpecs
);
// 사용자 동네 가져오기
router.get(
  "/neighborhoods",
  authenticateAccessToken,
  profileUserController.handleGetUserNeighborhoods
);

// 내 프로필 가져오기
router.get(
  "/profile",
  authenticateAccessToken,
  profileUserController.handleGetUserMyProfile
);
// 남의 프로필 가져오기
router.get(
  "/:user_id/profile",
  authenticateAccessToken,
  profileUserController.handleGetOtherUserProfile
);

// PATCH

// 사용자 프로필 수정
router.patch(
  "/email",
  authenticateAccessToken,
  patchUserController.handleEditUserEmail
);
router.patch(
  "/profile-image",
  authenticateAccessToken,
  patchUserController.handleEditUserProfileImage
);
router.patch(
  "/nickname",
  authenticateAccessToken,
  patchUserController.handleEditUserNickname
);

module.exports = router;

// Swagger Documentation - Users Controller
/**
 * @swagger
 * tags:
 *   name: Users Controller
 *   description: 사용자 관련 API 엔드포인트
 *
 * /users/terms:
 *   get:
 *     summary: 사용자의 동의한 약관을 가져옵니다.
 *     tags: [Users Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 동의한 약관 목록을 성공적으로 가져왔습니다.
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/getUsersTermsResponseSchema'
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *
 * /users/studyrooms:
 *   get:
 *     summary: 스터디룸 목록을 가져옵니다.
 *     tags: [Users Controller]
 *     responses:
 *       200:
 *         description: 스터디룸 목록을 성공적으로 가져왔습니다.
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/getUsersStudyroomsResponseSchema'
 *       500:
 *         description: 서버 오류
 *
 * /users/todos:
 *   get:
 *     summary: 사용자의 투두 목록을 가져옵니다.
 *     tags: [Users Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 투두 목록을 성공적으로 가져왔습니다.
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/getUsersTodosResponseSchema'
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *
 * /users/specs:
 *   get:
 *     summary: 사용자의 스펙목록을 가져옵니다.
 *     tags: [Users Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 사양을 성공적으로 가져왔습니다.
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/getUsersSpecsResponseSchema'
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *
 * /users/neighborhoods:
 *   get:
 *     summary: 동네 목록을 가져옵니다.
 *     tags: [Users Controller]
 *     responses:
 *       200:
 *         description: 동네 목록을 성공적으로 가져왔습니다.
 *       500:
 *         description: 서버 오류
 *
 * /users/profile:
 *   get:
 *     summary: 인증된 사용자의 프로필을 가져옵니다.
 *     tags: [Users Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 프로필을 성공적으로 가져왔습니다.
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *
 * /users/{user_id}/profile:
 *   get:
 *     summary: 특정 사용자의 프로필을 가져옵니다.
 *     tags: [Users Controller]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자의 고유 ID
 *     responses:
 *       200:
 *         description: 사용자의 프로필을 성공적으로 가져왔습니다.
 *       404:
 *         description: 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *
 * /users:
 *   patch:
 *     summary: 사용자의 프로필을 업데이트합니다.
 *     tags: [Users Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfileSchema'
 *     responses:
 *       200:
 *         description: 사용자의 프로필을 성공적으로 업데이트했습니다.
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 */
