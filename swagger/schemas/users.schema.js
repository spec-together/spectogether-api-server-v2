const getUsersTermsResponseSchema = {
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
        terms: {
          type: "array",
          items: {
            type: "object",
            properties: {
              term_id: {
                type: "integer",
                example: 1,
              },
              is_agreed: {
                type: "boolean",
                example: true,
              },
              last_agreed_at: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T13:49:59.611Z",
              },
            },
            required: ["term_id", "is_agreed", "last_agreed_at"],
          },
        },
      },
      required: ["terms"],
    },
  },
  required: ["resultType", "error", "success"],
};

const getUsersTodosResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      example: "SUCCESS",
    },
    error: {
      type: "string",
      nullable: true,
      example: null,
    },
    success: {
      type: "object",
      properties: {
        todos: {
          type: "array",
          items: {
            type: "object",
            properties: {
              todo_id: {
                type: "integer",
                example: 3,
              },
              title: {
                type: "string",
                example: "123",
              },
              subtitle: {
                type: "string",
                example: "123",
              },
              content: {
                type: "string",
                example: "123",
              },
              creater_id: {
                type: "integer",
                example: 6,
              },
              deadline: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T12:37:39.000Z",
              },
              status: {
                type: "string",
                example: "1",
              },
              created_at: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T12:38:28.800Z",
              },
              assigned_user_id: {
                type: "integer",
                example: 6,
              },
              assigned_status: {
                type: "string",
                example: "1",
              },
            },
            required: [
              "todo_id",
              "title",
              "subtitle",
              "content",
              "creater_id",
              "deadline",
              "status",
              "created_at",
              "assigned_user_id",
              "assigned_status",
            ],
          },
        },
      },
      required: ["todos"],
    },
  },
  required: ["resultType", "error", "success"],
};

const getUsersStudyroomsResponseSchema = {
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
        studyrooms: {
          type: "array",
          items: {
            type: "object",
            properties: {
              studyroom_id: {
                type: "integer",
                example: 1,
              },
              created_at: {
                type: "string",
                format: "date-time",
                example: "2024-12-06T13:49:59.596Z",
              },
            },
            required: ["studyroom_id", "created_at"],
          },
        },
      },
      required: ["studyrooms"],
    },
  },
  required: ["resultType", "error", "success"],
};

const getUsersSpecsResponseSchema = {
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
        specs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              spec_id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
                example: "영어 능통",
              },
            },
            required: ["spec_id", "title"],
          },
        },
      },
      required: ["specs"],
    },
  },
  required: ["resultType", "error", "success"],
};

module.exports = {
  getUsersTermsResponseSchema,
  getUsersTodosResponseSchema,
  getUsersStudyroomsResponseSchema,
  getUsersSpecsResponseSchema,
};
