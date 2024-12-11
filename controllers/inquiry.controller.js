// const {} = require("../services/inquiry.service.js");
const inquiryService = require("../services/inquiry.service.js");
const logger = require("../logger");
// TODO : req.user.user_id로 본인 문의글만 조회하도록 수정

/**
 * @desc    문의 목록 조회 핸들러
 * @route   GET /inquiries?page=1&limit=10
 * @access  Private
 */
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
    logger.error(
      `[handleGetInquiries]\nNAME: ${error.name}\nREASON: ${JSON.stringify(
        error.reason,
        null,
        2
      )}\nMESSAGE: ${JSON.stringify(error.message, null, 2)}\nSTACK: ${error.stack}`
    );
    next(error);
  }
};

// 추가적인 핸들러 필요 시 주석 해제 및 구현
// const handleGetInquiryById = async (req, res) => { /* ... */ };
// const handlePostInquiry = async (req, res) => { /* ... */ };
// const handlePutInquiry = async (req, res) => { /* ... */ };
// const handleDeleteInquiry = async (req, res) => { /* ... */ };

// module.exports = {
//   handleGetInquiries,
//   // handleGetInquiryById,
//   // ,,,
// };
