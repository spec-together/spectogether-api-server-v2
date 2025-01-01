const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/upload/upload.controller");
const logger = require("../logger");

router.post("/upload/image/s3", uploadController.multipleUploadToS3);
router.get("/image/:key", uploadController.getImageWithUrl);

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

router.get("/rt", (req, res) => {
  // console.log(req.cookies);
  const cookie = req.cookies.SPECTOGETHER_RT;
  logger.debug(`[testRouter] RT: ${cookie}`);
  res.status(200).send({
    cookie,
  });
});

module.exports = router;
