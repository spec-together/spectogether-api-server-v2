const inquiryRepository = require("../repositories/inquiry.repository");
const logger = require("../logger");
const { DatabaseError } = require("../errors");
// TODO : @param   {number} userId - 현재 사용자 ID 추가

/**
 * @desc    문의 목록 조회 서비스
 *
 * @param   {number} page  - 현재 페이지 번호
 * @param   {number} limit - 페이지당 항목 수
 * @param   {string|null} status - 문의 상태 필터링
 * @returns {object}       - 문의 목록 및 메타 정보
 */

const getAllInquiries = async (page = 1, limit = 10, status = null) => {
  // const getAllInquiries = async (userId, page = 1, limit = 10, status = null) => {
  // try {
  const result = await inquiryRepository.getAllInquiries(page, limit, status);
  // TODO : const result = await inquiryRepository.getAllInquiries(userId, page, limit, status = null)
  return {
    inquiries: result.inquiries,
    pagination: {
      page_size: limit,
      page: result.pagination.page, // current page
      total_items: result.pagination.total_items,
      total_pages: result.pagination.total_pages,
    },
    // currentPage: result.currentPage,
    // total: result.total,
    // totalPages: result.totalPages,
  };
  // return result;
  // } catch (error) {
  // logger.error(
  //   `inquiry.service.js - Error fetching inquiries: ${error.message}`
  // );
  throw new DatabaseError("문의 목록을 불러오는 중 오류가 발생했습니다.");

  // throw new Error("문의 목록을 불러오는 중 오류가 발생했습니다.");
  // }
};

// 추가적인 서비스 필요 시 주석 해제 및 구현
// const getInquiryById = async (id) => { /* ... */ };
// const createInquiry = async (data) => { /* ... */ };
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };

module.exports = {
  getAllInquiries,
};
