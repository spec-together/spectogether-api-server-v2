const { NotExistsError } = require("../errors");
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

exports.updateInquiry = async (id, data) => {
  const [updatedRows] = await Inquiry.update(data, {
    where: { inquiry_id: id },
  });

  if (updatedRows === 0) {
    throw new NotExistsError("문의가 존재하지 않습니다.");
  }

  const updatedInquiry = await Inquiry.findOne({ where: { inquiry_id: id } });
  return updatedInquiry;
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

exports.deleteInquiry = async (inquiryId) => {
  const deletedRows = await Inquiry.destroy({
    where: { inquiry_id: inquiryId },
  });

  if (deletedRows === 0) {
    throw new NotExistsError("문의가 존재하지 않습니다.");
  }
};
