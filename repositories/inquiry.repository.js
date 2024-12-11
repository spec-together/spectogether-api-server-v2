const { Inquiry, InquiryAnswer } = require("../models");
// TODO : @param   {number} userId - 현재 사용자 ID 추가

/**
 * @desc    모든 문의 조회
 * @param   {object} whereClause - 조회 조건
 * @param   {number} limit - 한 페이지당 항목 수
 * @param   {number} offset - 데이터 오프셋
 * @returns {object} - 문의 목록과 총 개수
 */

exports.findInquiries = async (whereClause, limit, offset) => {
  const { rows, count } = await Inquiry.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: InquiryAnswer,
        as: "inquiryAnswers", // 모델에서 정의한 별칭과 일치
        required: false, // 답변이 없어도 문의를 포함
      },
    ],
  });
  return { inquiries: rows, totalItems: count };
};

// 추가적인 리포지토리 필요 시 주석 해제 및 구현
exports.createInquiry = async (inquiryData) => {
  const newInquiry = await Inquiry.create(inquiryData);
  return newInquiry;
};
/**
 * @desc    특정 문의 조회
 * @param   {number} userId - 현재 사용자 ID
 * @param   {number} inquiryId - 조회할 문의 ID
 * @returns {object|null} - 문의 상세 정보 또는 null
 */
exports.findInquiryById = async (userId, inquiryId) => {
  const inquiry = await Inquiry.findOne({
    where: {
      inquiry_id: inquiryId,
      user_id: userId,
    },
    include: [
      {
        model: InquiryAnswer,
        as: "inquiryAnswers",
        required: false,
      },
    ],
  });

  return inquiry;
};
// const getInquiryById = async (id) => { /* ... */ };
// const createInquiry = async (data) => { /* ... */ };
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };

// module.exports = {
//   findInquiries,
// };
