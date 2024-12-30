const noticeService = require("../../services/notice/notice.service.js");

const getAllNotices = async (req, res, next) => {
  try {
    const result = await noticeService.getAllNotices({});
    res.status(200).success({ notices: result.notices });
  } catch (error) {
    next(error);
  }
};

const getNoticeByNoticeId = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const result = await noticeService.getNoticeByNoticeId({
      noticeId: noticeId,
    });
    res.status(200).success({ notice: result.notice });
  } catch (error) {
    next(error);
  }
};

// const uploadService = require("../../services/upload/upload.service.js");

const createNotice = async (req, res, next) => {
  // TODO : admin 인지 확인하기
  // TODO : 이미지 업로드를 S3로 변경하기
  try {
    const { user_id: authorId } = req.user;
    const { title, content } = req.body;
    // console.log("req.body:", req.body);
    const noticeImages = req.files // .filter((file) => file !== undefined)
      .map((file) => ({ image_url: file.path }));
    const result = await noticeService.createNotice({
      authorId,
      title,
      content,
      noticeImages,
    });
    res.status(201).success({
      message: "공지 생성 성공",
      notice_id: result.notice.notice_id,
    });
  } catch (error) {
    next(error);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const { user_id: authorId } = req.user;
    const { noticeId } = req.params;
    const { title, content } = req.body;
    const noticeImages = req.files.map((file) => ({ image_url: file.path }));

    const result = await noticeService.updateNotice({
      authorId,
      noticeId,
      title,
      content,
      noticeImages,
    });
    res
      .status(200)
      .success({ message: result.message, notice_id: result.notice.notice_id });
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const { user_id: authorId } = req.user;
    const { noticeId } = req.params;
    const result = await noticeService.deleteNotice({
      authorId,
      noticeId: parseInt(noticeId),
    });
    res.status(200).success({ message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotices,
  getNoticeByNoticeId,
  createNotice,
  updateNotice,
  deleteNotice,
};
