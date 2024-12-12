const inquiryRepository = require("../repositories/inquiry.repository");
const {
  DatabaseError,
  InvalidInputError,
  NotExistsError,
} = require("../errors");
const { validateInquiryAnswerInput } = require("./inquiry.validator.js");

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

exports.updateInquiry = async (userId, inquiryId, updateData) => {
  if (isNaN(inquiryId)) {
    throw new InvalidInputError("유효한 문의 ID를 입력해주세요.");
  }

  // 추가적인 유효성 검사 로직이 필요하면 여기에 작성

  const inquiry = await inquiryRepository.findInquiryById(userId, inquiryId);
  if (!inquiry) {
    throw new NotExistsError("문의가 존재하지 않습니다.");
  }

  const updatedInquiry = await inquiryRepository.updateInquiry(
    inquiryId,
    updateData
  );
  return updatedInquiry;
};

exports.deleteInquiry = async (userId, inquiryId) => {
  if (isNaN(inquiryId)) {
    throw new InvalidInputError("유효한 문의 ID를 입력해주세요.");
  }

  try {
    const inquiry = await inquiryRepository.findInquiryById(userId, inquiryId);
    if (!inquiry) {
      throw new NotExistsError("해당 문의가 존재하지 않습니다.");
    }

    await inquiryRepository.deleteInquiry(inquiryId);
  } catch (error) {
    throw new DatabaseError("문의를 삭제하는 중 오류가 발생했습니다.");
  }
};

// TODO : 답변 생성 로직 추가. 아래 코드는 미완성입니다.
// exports.createInquiryAnswer = async (inquiryId, answerData) => {
//   try {
//     // 입력 데이터 검증
//     validateInquiryAnswerInput(answerData);

//     const inquiry = await inquiryRepository.findInquiryById(null, inquiryId);
//     if (!inquiry) {
//       throw new NotExistsError("해당 문의가 존재하지 않습니다.");
//     }

//     const answer = await inquiryRepository.createInquiryAnswer({
//       inquiry_id: inquiryId,
//       ...answerData,
//     });

//     return answer;
//   } catch (error) {
//     if (error instanceof InvalidInputError) {
//       throw error;
//     }
//     throw new DatabaseError("답변을 생성하는 중 오류가 발생했습니다.");
//   }
// };
