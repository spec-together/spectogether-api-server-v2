const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/upload/upload.controller");

router.post("/upload/image/s3", uploadController.multipleUploadToS3);

module.exports = router;
