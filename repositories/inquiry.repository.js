const { Inquiry, InquiryAnswer } = require("../models");
const logger = require("../logger");
const { where } = require("sequelize");
// TODO : @param   {number} userId - 현재 사용자 ID 추가

/**
 * @desc    문의 목록 조회 리포지토리
 *
 * @param   {number} page  - 현재 페이지 번호
 * @param   {number} limit - 페이지당 항목 수
 * @param   {string|null} status - 문의 상태 필터링
 * @returns {object}       - 문의 목록 및 메타 정보
 */

const getAllInquiries = async (page, limit, status) => {
  // TODO : const getAllInquiries = async (userId, page, limit, status) => {
  try {
    const offset = (page - 1) * limit;

    const whereClause = {};
    // const whereClause = { user_id: userId };

    if (status) {
      whereClause.status = status;
    }
    const { rows, count } = await Inquiry.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: InquiryAnswer,
          as: "inquiryAnswers", // 모델에서 정의한 별칭과 일치
          required: false, // 답변이 없어도 문의를 포함
        },
      ],
    });
    return {
      inquiries: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    logger.error(
      `inquiry.repository.js - Error fetching inquiries: ${error.message}`
    );
    throw new Error("문의 데이터를 불러오는 중 오류가 발생했습니다.");
  }
};

// 추가적인 리포지토리 필요 시 주석 해제 및 구현
// const getInquiryById = async (id) => { /* ... */ };
// const createInquiry = async (data) => { /* ... */ };
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };

module.exports = {
  getAllInquiries,
};
