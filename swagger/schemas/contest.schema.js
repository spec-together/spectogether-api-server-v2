const { format } = require("morgan");

const CreateContestRequestSchema = {
  type: "object",
  properties: {
    application_url: {
      type: "string",
      format: "uri",
    },
    image: {
      type: "string",
      format: "binary",
      description: "공모전 대표 이미지", // 계획 : 10MB 이하, jpg/jpeg/png만 허용
    },
    title: {
      type: "string",
      example: "제7회 SW개발 공모전",
    },
    subtitle: {
      type: "string",
      example: "미래를 바꾸는 SW 아이디어",
    },
    description: {
      type: "string",
      example: "상세한 공모전 설명...",
    },
    host: {
      type: "string",
      example: "과학기술정보통신부",
    },
    location: {
      type: "object",
      properties: {
        type: { type: "string", example: "Point" },
        coordinates: {
          type: "array",
          items: { type: "number" },
          example: [127.0276, 37.4979],
        },
      },
    },
    online_offline_type: {
      type: "string",
      enum: ["online", "offline", "hybrid"],
    },
    application_start_date: {
      type: "string",
      format: "date-time",
      example: "2024-12-06T13:49:59.611Z",
    },
    application_end_date: {
      type: "string",
      format: "date-time",
      example: "2024-12-06T13:49:59.611Z",
    },
    start_date: {
      type: "string",
      format: "date-time",
      example: "2024-12-06T13:49:59.611Z",
    },
    end_date: {
      type: "string",
      format: "date-time",
      example: "2024-12-06T13:49:59.611Z",
    },
  },
};

const CreateContestResponseSchema = {
  type: "object",
  properties: {
    resultType: {
      type: "string",
      enum: ["SUCCESS"],
    },
    error: {
      type: ["object", "null"],
      default: null,
    },
    success: {
      type: "object",
      properties: {
        contest: {
          type: "object",
          properties: {
            application_url: { type: "string", format: "uri" },
            contest_id: { type: "integer" },
            title: { type: "string" },
            subtitle: { type: "string" },
            description: { type: "string" },
            host: { type: "string" },
            location: {
              type: "object",
              properties: {
                type: { type: "string" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                },
              },
            },
            online_offline_type: {
              type: "string",
              enum: ["online", "offline", "hybrid"],
            },
            image_url: {
              type: "string",
              description: "서버에 저장된 이미지 URL",
              example: "http://localhost:9999/uploads/contests/1234567890.jpg",
            },
          },
        },
        contestCalendar: {
          type: "object",
          properties: {
            contest_calendar_id: { type: "integer" },
            contest_id: { type: "integer" },
            calendar_id: { type: "integer" },
          },
        },
        contestBoard: {
          type: "object",
          properties: {
            contest_board_id: { type: "integer" },
            contest_id: { type: "integer" },
            board_id: { type: "integer" },
          },
        },
        message: {
          type: "string",
          example: "대회를 성공적으로 생성했습니다.",
        },
      },
    },
  },
};

module.exports = {
  CreateContestRequestSchema,
  CreateContestResponseSchema,
};
