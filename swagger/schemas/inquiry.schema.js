// schemas/inquiry.schema.js
const InquirySchema = {
  Inquiry: {
    type: "object",
    properties: {
      inquiry_id: {
        type: "integer",
        description: "게시물 ID",
      },
      user_id: {
        type: "integer",
        description: "사용자 ID",
      },
      title: {
        type: "string",
        description: "게시물 제목",
      },
      content: {
        type: "string",
        description: "게시물 내용",
      },
      image_url: {
        type: "string",
        description: "이미지 URL",
      },
      read_at: {
        type: "string",
        format: "date-time",
        description: "읽은 시간",
      },
      answered_at: {
        type: "string",
        format: "date-time",
        description: "답변한 시간",
      },
      status: {
        type: "string",
        description: "게시물 상태",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "게시물 생성 일시",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "게시물 수정 일시",
      },
      InquiryAnswers: {
        type: "array",
        items: { $ref: "#/components/schemas/InquiryAnswer" },
      },
    },
    required: [
      "inquiry_id",
      "user_id",
      "title",
      "content",
      "image_url",
      "read_at",
      "answered_at",
      "status",
      "created_at",
      "updated_at",
    ],
  },

  InquiryAnswer: {
    type: "object",
    properties: {
      inquiry_answer_id: {
        type: "integer",
        description: "답변 ID",
      },
      inquiry_id: {
        type: "integer",
        description: "문의 ID",
      },
      admin_id: {
        type: "integer",
        description: "관리자 ID",
      },
      title: {
        type: "string",
        description: "답변 제목",
      },
      content: {
        type: "string",
        description: "답변 내용",
      },
      image_url: {
        type: "string",
        description: "이미지 URL",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "답변 생성 일시",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "답변 수정 일시",
      },
    },
    required: [
      "inquiry_answer_id",
      "inquiry_id",
      "admin_id",
      "title",
      "content",
      "image_url",
      "created_at",
      "updated_at",
    ],
  },
};

module.exports = InquirySchema;
