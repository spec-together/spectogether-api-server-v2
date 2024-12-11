const inquiryService = require("../services/inquiry.service.js");
const logger = require("../logger");
const path = require("node:path");

exports.handleGetInquiries = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || null;

    const result = await inquiryService.getAllInquiries(
      userId,
      page,
      limit,
      status
    );
    const { inquiries, pagination } = result;
    return res.status(200).success({
      inquiries,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.handlePostInquiry = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { title, content } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `${req.protocol}://${req.get("host")}/uploads/inquiries/${req.file.filename}`;
    }
    const newInquiry = await inquiryService.createInquiry(userId, {
      title,
      content,
      image_url,
    });
    return res.status(201).success(newInquiry);
  } catch (error) {
    next(error);
  }
};

exports.handleGetInquiryById = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const inquiryId = parseInt(req.params.id, 10);

    // if (isNaN(inquiryId)) {
    //   return res.status(400).error({
    //     errorCode: "INVALID_ID",
    //     reason: "유효한 문의 ID를 입력해주세요.",
    //   }); // TODO : 오류 처리 위치 변경 고려, 형태 통일
    // }

    const inquiry = await inquiryService.getInquiryById(userId, inquiryId);

    // if (!inquiry) {
    //   return res.status(404).error({
    //     errorCode: "NOT_FOUND",
    //     reason: "문의가 존재하지 않습니다.",
    //   }); // TODO : 오류 처리 위치 변경 고려, 형태 통일
    // }

    return res.status(200).success(inquiry);
  } catch (error) {
    next(error);
  }
};

// 추가적인 핸들러 필요 시 주석 해제 및 구현

// const handlePutInquiry = async (req, res) => { /* ... */ };
// const handleDeleteInquiry = async (req, res) => { /* ... */ };
