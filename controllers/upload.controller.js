// controllers/upload.controller.js
const uploadService = require("../services/upload/upload.service");

const handleUpload = (destination) => {
  const upload = uploadService
    .createUploadMiddleware(destination)
    .single("image");

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        return next(err);
      }
      // 업로드 후 추가 처리 로직
      // res.status(200).json({ filename: req.file.filename });
      next();
    });
  };
};
module.exports = {
  handleUpload,
};
