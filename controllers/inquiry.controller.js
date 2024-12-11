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
    return res.status(201).success(newInquiry); // TODO : 사용하지 않는 내용은 반환하지 않도록 수정
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

exports.handlePutInquiry = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const inquiryId = parseInt(req.params.id, 10);
    const { title, content } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `${req.protocol}://${req.get("host")}/uploads/inquiries/${req.file.filename}`;
    }

    const updateData = { title, content };
    if (image_url) {
      updateData.image_url = image_url;
    }

    const updatedInquiry = await inquiryService.updateInquiry(
      userId,
      inquiryId,
      updateData
    );
    return res.status(200).success(updatedInquiry); // TODO : 사용하지 않는 내용은 반환하지 않도록 수정
  } catch (error) {
    next(error);
  }
};

exports.handleDeleteInquiry = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const inquiryId = parseInt(req.params.id, 10);

    await inquiryService.deleteInquiry(userId, inquiryId);
    return res.status(204).send(); // TODO : 형태 통일 필요한지 고려
  } catch (error) {
    next(error);
  }
};
