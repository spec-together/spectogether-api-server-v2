const express = require("express");
const eventRouter = express.Router();
const eventController = require("../controllers/event/event.controller.js");
const uploadController = require("../controllers/upload/upload.controller");
const authMiddleware = require("../middleware/authenticate.jwt.js");

const eventUploadPath = "uploads/events";

eventRouter.get("/", eventController.getAllEvents);

eventRouter.post(
  "/",
  authMiddleware.authenticateAccessToken,
  uploadController.handlefieldsUpload(eventUploadPath),
  eventController.createEvent
);

eventRouter.get("/:eventId", eventController.getEventByEventId);

eventRouter.patch(
  "/:eventId",
  authMiddleware.authenticateAccessToken,
  // uploadController.handleArrayUpload(eventUploadPath),
  uploadController.handlefieldsUpload(eventUploadPath),
  eventController.updateEvent
);

eventRouter.delete(
  "/:eventId",
  authMiddleware.authenticateAccessToken,
  eventController.deleteEvent
);

eventRouter.get(
  "/:eventId/todos",
  // authMiddleware.authenticateAccessToken,
  eventController.getEventBasicInfo
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
