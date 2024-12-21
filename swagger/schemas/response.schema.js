const DefaultErrorResponseSchema = {
  type: "object",
  properties: {
    errorCode: {
      type: "string",
      description: "에러 코드",
    },
    reason: {
      type: "string",
      description: "에러 원인",
    },
    data: {
      type: "object",
      description: "추가 에러 데이터",
    },
  },
  required: ["errorCode", "reason"],
};

module.exports = {
  DefaultErrorResponseSchema,
};
