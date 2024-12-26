const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/upload/upload.controller");

router.post("/upload/image/s3", uploadController.multipleUploadToS3);
router.get("/image/:key", uploadController.getImageWithUrl);

module.exports = router;
