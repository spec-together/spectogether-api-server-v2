const express = require("express");
const eventRouter = express.Router();
const eventController = require("../controllers/event/event.controller.js");
// const uploadController = require("../controllers/upload/upload.controller");
const authMiddleware = require("../middleware/authenticate.jwt.js");

// const contestUploadPath = "uploads/contests/";

eventRouter.get("/", eventController.getAllevents);
eventRouter.get("/:id", eventController.getEventById);
eventRouter.post(
  "/",
  authMiddleware.authenticateAccessToken,
  eventController.createEvent
);

module.exports = eventRouter;

// router.get("/", contestController.getAllContests);
// router.get("/:id", contestController.getContestById);
// // router.post("/", contestController.createContest);
// router.post(
//   "/",
//   // authenticateAccessToken, // TODO : 권한 체크 기능 추가
//   uploadController.handleUpload(contestUploadPath),
//   contestController.createContestWithAssociations
// );
