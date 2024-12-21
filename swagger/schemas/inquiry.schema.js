const getAllInquiriesResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: ["object", "null"],
      example: null,
    },
    success: {
      type: "object",
      properties: {
        inquiries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              inquiry_id: {
                type: "integer",
                example: 1,
              },
              user_id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
                example: "문의 제목",
              },
              content: {
                type: "string",
                example: "문의 내용",
              },
              status: {
                type: "string",
                example: "open",
              },
              created_at: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T13:49:59.611Z",
              },
              updated_at: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T13:49:59.611Z",
              },
            },
            required: [
              "inquiry_id",
              "user_id",
              "title",
              "content",
              "status",
              "created_at",
              "updated_at",
            ],
          },
        },
      },
      required: ["inquiries"],
    },
  },
  required: ["resultType", "error", "success"],
};

const getInquiryResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: ["object", "null"],
      example: null,
    },
    success: {
      type: "object",
      properties: {
        inquiry: {
          type: "object",
          properties: {
            inquiry_id: {
              type: "integer",
              example: 1,
            },
            user_id: {
              type: "integer",
              example: 1,
            },
            title: {
              type: "string",
              example: "문의 제목",
            },
            content: {
              type: "string",
              example: "문의 내용",
            },
            status: {
              type: "string",
              example: "open",
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2024-12-06T13:49:59.611Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2024-12-06T13:49:59.611Z",
            },
          },
          required: [
            "inquiry_id",
            "user_id",
            "title",
            "content",
            "status",
            "created_at",
            "updated_at",
          ],
        },
      },
      required: ["inquiry"],
    },
  },
  required: ["resultType", "error", "success"],
};

const createInquiryResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: ["object", "null"],
      example: null,
    },
    success: {
      type: "object",
      properties: {
        inquiry_id: {
          type: "integer",
          example: 1,
        },
      },
      required: ["inquiry_id"],
    },
  },
  required: ["resultType", "error", "success"],
};

const updateInquiryResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: ["object", "null"],
      example: null,
    },
    success: {
      type: "object",
      properties: {
        inquiry_id: {
          type: "integer",
          example: 1,
        },
      },
      required: ["inquiry_id"],
    },
  },
  required: ["resultType", "error", "success"],
};

const deleteInquiryResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: ["object", "null"],
      example: null,
    },
    success: {
      type: "object",
      properties: {
        inquiry_id: {
          type: "integer",
          example: 1,
        },
      },
      required: ["inquiry_id"],
    },
  },
  required: ["resultType", "error", "success"],
};

module.exports = {
  getAllInquiriesResponseSchema,
  getInquiryResponseSchema,
  createInquiryResponseSchema,
  updateInquiryResponseSchema,
  deleteInquiryResponseSchema,
};
