const inquiryRepository = require("../repositories/inquiry.repository");
const { DatabaseError } = require("../errors");
// const { validateCreateInquiry } = require("../validators/inquiry.validation.service.js"); // inquiry.validator.js ?

/**
 * @desc    문의 목록 조회 서비스
 * @param   {number} userId - 현재 사용자 ID
 * @param   {number} page - 현재 페이지 번호
 * @param   {number} limit - 페이지당 항목 수
 * @param   {string|null} status - 문의 상태 필터링
 * @returns {object} - 문의 목록 및 페이징 정보
 */

exports.getAllInquiries = async (userId, page, limit, status) => {
  const offset = (page - 1) * limit;

  const whereClause = {
    user_id: userId, // 사용자 ID로 필터링
  };
  if (status) {
    whereClause.status = status;
  }
  try {
    const { inquiries, totalItems } = await inquiryRepository.findInquiries(
      whereClause,
      limit,
      offset
    );
    const totalPages = Math.ceil(totalItems / limit);

    return {
      inquiries,
      paginations: {
        total_items: totalItems,
        total_pages: totalPages,
        page,
        limit,
        next: page < totalPages ? `/inquiries?page=${page + 1}` : null,
        previous: page > 1 ? `/inquiries?page=${page - 1}` : null,
      },
    };
  } catch (error) {
    throw new DatabaseError("문의 목록을 불러오는 중 오류가 발생했습니다.");
  }
};

// 추가적인 서비스 필요 시 주석 해제 및 구현

// exports.createInquiry = async (userId, title, content, imageUrl) => {}
exports.createInquiry = async (userId, data) => {
  try {
    // validateCreateInquiry(data);
    return await inquiryRepository.createInquiry({ user_id: userId, ...data });
  } catch (error) {
    throw new DatabaseError("문의를 생성하는 중 오류가 발생했습니다.");
  }
};
exports.getInquiryById = async (userId, inquiryId) => {
  try {
    const inquiry = await inquiryRepository.findInquiryById(userId, inquiryId);
    return inquiry;
  } catch (error) {
    throw new DatabaseError("문의를 불러오는 중 오류가 발생했습니다.");
  }
};
// const createInquiry = async (data) => { /* ... */ };
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };

// module.exports = {
//   getAllInquiries,
// };
