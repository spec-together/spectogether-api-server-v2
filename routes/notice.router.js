const express = require("express");
const noticeRouter = express.Router();
const noticeController = require("../controllers/notice/notice.controller");
// const upload
const authMiddleware = require("../middleware/authenticate.jwt");

// (TEST) upload.service.js 대신 그냥 여기에 작성
const multer = require("multer");
const path = require("node:path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/notices");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }); //
// module.exports = upload;
// exports.upload = multer({ storage: storage });

noticeRouter.get("/", noticeController.getAllNotices); // 페이지네이션 추가 전
noticeRouter.post(
  "/",
  authMiddleware.authenticateAccessToken,
  upload.array("images", 5), // images 이외의 필드는 req.body로 들어온다고 한다.
  noticeController.createNotice
);
noticeRouter.get("/:noticeId", noticeController.getNoticeByNoticeId);
noticeRouter.patch(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  upload.array("images", 5),
  noticeController.updateNotice
);
noticeRouter.delete(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  noticeController.deleteNotice
);

module.exports = noticeRouter;
