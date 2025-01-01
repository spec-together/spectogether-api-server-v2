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
// studyroomRouter.delete("/:id",authenticateMiddleware.authenticateAccessToken,studyroomController.deleteStudyroom);

module.exports = studyroomRouter;
