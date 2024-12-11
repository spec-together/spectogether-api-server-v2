// schemas/inquiry.schema.js
const InquirySchema = {
  Inquiry: {
    type: "object",
    properties: {
      inquiry_id: { type: "integer", description: "문의 ID", example: 1 },
      user_id: { type: "integer", description: "사용자 ID", example: 123 },
      title: {
        type: "string",
        description: "문의 제목",
        example: "문의 제목 예시",
      },
      content: {
        type: "string",
        description: "문의 내용",
        example: "문의 내용 예시",
      },
      image_url: {
        type: "string",
        description: "이미지 URL",
        example: "http://example.com/image.png",
      },
      read_at: {
        type: "string",
        format: "date-time",
        description: "읽은 시간",
        example: "2024-12-11T07:19:35.800Z",
      },
      answered_at: {
        type: "string",
        format: "date-time",
        description: "답변된 시간",
        example: "2024-12-12T08:00:00.000Z",
      },
      status: {
        type: "string",
        description: "문의 상태",
        enum: ["pending", "answered", "closed"],
        example: "pending",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "문의 생성 일시",
        example: "2024-12-11T07:19:35.800Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "문의 수정 일시",
        example: "2024-12-11T07:19:35.800Z",
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
        example: 1,
      },
      inquiry_id: { type: "integer", description: "문의 ID", example: 1 },
      admin_id: { type: "integer", description: "관리자 ID", example: 10 },
      title: {
        type: "string",
        description: "답변 제목",
        example: "답변 제목 예시",
      },
      content: {
        type: "string",
        description: "답변 내용",
        example: "답변 내용 예시",
      },
      image_url: {
        type: "string",
        description: "답변 이미지 URL",
        example: "http://example.com/answer_image.png",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "답변 생성 일시",
        example: "2024-12-12T08:00:00.000Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "답변 수정 일시",
        example: "2024-12-12T08:00:00.000Z",
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

  Pagination: {
    type: "object",
    properties: {
      total_pages: { type: "integer", example: 5 },
      total_items: { type: "integer", example: 50 },
      page: { type: "integer", example: 1 },
      prev: {},
      next: {},
    },
    required: ["currentPage", "totalPages", "totalItems"],
  },

  GetInquiriesResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          inquiries: {
            type: "array",
            items: { $ref: "#/components/schemas/Inquiry" },
          },
          pagination: {
            $ref: "#/components/schemas/Pagination",
          },
        },
      },
    },
    required: ["success", "data"],
  },

  CreateInquirySchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "문의 제목",
        example: "문의 제목 예시",
      },
      content: {
        type: "string",
        description: "문의 내용",
        example: "문의 내용 예시",
      },
      image: {
        type: "string",
        format: "binary",
        description: "문의에 첨부된 이미지 파일",
      },
    },
    required: ["title", "content"],
  },

  CreateInquiryResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "문의가 성공적으로 생성되었습니다.",
          }, // ?
          inquiry: { $ref: "#/components/schemas/Inquiry" },
        },
      },
    },
    required: ["success", "data"],
  },
  // UpdateInquiryResponse: {
  //   type: "object",
  //   properties: {
  //     success: { type: "boolean", example: true },
  //     data: {
  //       type: "object",
  //       properties: {
  //         message: { type: "string", example: "문의가 성공적으로 업데이트되었습니다." },
  //         inquiry: { $ref: "#/components/schemas/Inquiry" }
  //       }
  //     }
  //   },
  //   required: ["success", "data"]
  // },

  // DeleteInquiryResponse: {
  //   type: "object",
  //   properties: {
  //     success: { type: "boolean", example: true },
  //     data: {
  //       type: "object",
  //       properties: {
  //         message: { type: "string", example: "문의가 성공적으로 삭제되었습니다." }
  //       }
  //     }
  //   },
  //   required: ["success", "data"]
  // },

  // DefaultErrorResponseSchema: {
  //   type: "object",
  //   properties: {
  //     errorCode: { type: "string", description: "에러 코드", example: "INVALID_REQUEST" },
  //     reason: { type: "string", description: "에러 원인", example: "잘못된 요청입니다." },
  //     data: { type: "object", description: "추가 에러 데이터", example: {} }
  //   },
  //   required: ["errorCode", "reason"]
  // }
};

module.exports = InquirySchema;
