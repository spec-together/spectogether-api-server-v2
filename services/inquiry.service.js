const inquiryRepository = require("../repositories/inquiry.repository");
const {
  DatabaseError,
  InvalidInputError,
  NotExistsError,
} = require("../errors");
// const { validateCreateInquiry } = require("../validators/inquiry.validation.service.js"); // inquiry.validator.js ?

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

exports.createInquiry = async (userId, data) => {
  try {
    // validateCreateInquiry(data);
    return await inquiryRepository.createInquiry({ user_id: userId, ...data });
  } catch (error) {
    throw new DatabaseError("문의를 생성하는 중 오류가 발생했습니다.");
  }
};

exports.getInquiryById = async (userId, inquiryId) => {
  if (isNaN(inquiryId)) {
    throw new InvalidInputError("유효한 문의 ID를 입력해주세요.");
  }

  try {
    const inquiry = await inquiryRepository.findInquiryById(userId, inquiryId);
    if (!inquiry) {
      throw new NotExistsError("해당 문의가 존재하지 않습니다.");
    }
    return inquiry;
  } catch (error) {
    throw new DatabaseError("문의를 불러오는 중 오류가 발생했습니다.");
  }
};

// 추가적인 서비스 필요 시 주석 해제 및 구현
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };
