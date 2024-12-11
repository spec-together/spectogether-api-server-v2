const { Inquiry, InquiryAnswer } = require("../models");

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

exports.createInquiry = async (inquiryData) => {
  const newInquiry = await Inquiry.create(inquiryData);
  return newInquiry;
};

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

// 추가적인 리포지토리 필요 시 주석 해제 및 구현
// const updateInquiry = async (id, data) => { /* ... */ };
// const deleteInquiry = async (id) => { /* ... */ };
