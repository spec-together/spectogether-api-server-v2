const express = require("express");
const studyroomRouter = express.Router();
const studyroomController = require("../controllers/studyroom/studyroom.controller.js");
const authenticateMiddleware = require("../middleware/authenticate.jwt");
const uploadController = require("../controllers/upload/upload.controller.js");
const validate = require("../middleware/validate.js");
const studyroomValidator = require("../utils/validators/studyroom.validator.js");

// 스터디룸 기본 CRUD 2개
studyroomRouter.get("/", studyroomController.getAllStudyrooms);
studyroomRouter.post(
  "/",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.singleUploadToS3,
  validate(studyroomValidator.createStudyroom),
  studyroomController.createStudyroom
);

// 초대 관리 - 초대받은 목록 조회, 수락. 경로 우선순위 때문에 이곳에 위치.
// TODO : 사용자 단위의 기능이라 별도 라우터로 이동하는게 맞다.
studyroomRouter.get(
  "/invites",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.getReceivedInvites
);
studyroomRouter.patch(
  "/invites/:inviteId/accept",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.acceptInvitation
);
// TODO : 초대 거절

// 스터디룸 기본 CRUD 2개
studyroomRouter.get(
  "/:studyroomId",
  studyroomController.getStudyroomByStudyroomId
);
// studyroomRouter.patch("/:studyroomId",authenticateMiddleware.authenticateAccessToken,studyroomController.updateStudyroom);
studyroomRouter.delete(
  "/:studyroomId",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.deleteStudyroom
);

// 스터디룸 멤버 관리
studyroomRouter.get(
  "/:studyroomId/members",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.getMembersByStudyroomId
);
studyroomRouter.post(
  "/:studyroomId/join",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.joinStudyroom
);

// 초대 관리 - 초대하기
studyroomRouter.post(
  "/:studyroomId/invites",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.inviteUser
);

// 스터디룸 투두 관리
studyroomRouter.get(
  "/:studyroomId/todos",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.getTodosByStudyroomId
);
studyroomRouter.post(
  "/:studyroomId/todos",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.handleSingleUpload("uploads/todos", "image"), // none. form-data 형태로 받는 용도
  studyroomController.createTodo
);
studyroomRouter.post(
  "/:studyroomId/todos/:todoId/join",
  authenticateMiddleware.authenticateAccessToken,
  // uploadController.handleSingleUpload("uploads/todos", "image"),
  uploadController.singleUploadToS3, // 현재는 이미지 첨부 안하는 이런 경우도 모두 form-data로 받도록 해서 일관성 유지, 대신 s3 관련 코드에서 업로드 안한 경우 에러처리를 주석처리 했다.
  studyroomController.joinTodo
);
studyroomRouter.patch(
  "/:studyroomId/todos/:todoId",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.singleUploadToS3,
  studyroomController.submitTodo
);

module.exports = studyroomRouter;
