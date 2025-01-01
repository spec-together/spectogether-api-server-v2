const express = require("express");
const studyroomRouter = express.Router();
const studyroomController = require("../controllers/studyroom/studyroom.controller.js");
const authenticateMiddleware = require("../middleware/authenticate.jwt");
const uploadController = require("../controllers/upload/upload.controller.js");

studyroomRouter.get("/", studyroomController.getAllStudyrooms);
studyroomRouter.get("/:id", studyroomController.getStudyroomByStudyroomId);
studyroomRouter.post(
  "/",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.handleUpload("uploads/studyrooms"),
  studyroomController.createStudyroom
);
studyroomRouter.post(
  "/:studyroomId",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.joinStudyroom
); // TODO : 스터디룸 가입

// studyroomRouter.patch("/:id",authenticateMiddleware.authenticateAccessToken,studyroomController.updateStudyroom);

studyroomRouter.delete(
  "/:studyroomId",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.deleteStudyroom
);

studyroomRouter.get(
  "/:studyroomId/todos",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.getTodosByStudyroomId
);

studyroomRouter.post(
  "/:studyroomId/todos",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.handleUpload("uploads/todos", "image"), // none
  studyroomController.createTodo
);

studyroomRouter.post(
  "/:studyroomId/todos/:todoId",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.handleUpload("uploads/todos", "image"),
  studyroomController.joinTodo
);

studyroomRouter.patch(
  "/:studyroomId/todos/:todoId",
  authenticateMiddleware.authenticateAccessToken,
  uploadController.handleUpload("uploads/todos", "image"),
  studyroomController.submitTodo
);

studyroomRouter.get(
  "/:studyroomId/members",
  authenticateMiddleware.authenticateAccessToken,
  studyroomController.getMembersByStudyroomId
);

module.exports = studyroomRouter;
