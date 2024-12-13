const todoSchema = {
  Todo: {
    type: "object",
    properties: {
      todo_id: {
        type: "integer",
        example: 10,
      },
      deadline: {
        type: "string",
        format: "date-time",
        example: "2024-12-31T23:59:59Z",
      },
      title: {
        type: "string",
        example: "프로젝트 마감",
      },
      subtitle: {
        type: "string",
        example: "최종 보고서 제출",
      },
      content: {
        type: "string",
        example: "최종 보고서를 작성하여 제출해야 합니다.",
      },
      creater_id: {
        type: "integer",
        example: 5,
      },
      status: {
        type: "string",
        example: "pending",
      },
      created_at: {
        type: "string",
        format: "date-time",
        example: "2024-04-27T12:34:56Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        example: "2024-04-27T12:34:56Z",
      },
      studyrooms: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Studyroom",
        },
        description: "연결된 스터디룸 리스트",
      },
    },
    required: [
      "deadline",
      "title",
      "subtitle",
      "content",
      "creater_id",
      "status",
    ],
  },
  TodoRequest: {
    type: "object",
    required: ["deadline", "title", "subtitle", "content", "studyroom_id"],
    properties: {
      deadline: {
        type: "string",
        format: "date-time",
        example: "2024-12-31T23:59:59Z",
      },
      title: {
        type: "string",
        example: "프로젝트 마감",
      },
      subtitle: {
        type: "string",
        example: "최종 보고서 제출",
      },
      content: {
        type: "string",
        example: "최종 보고서를 작성하여 제출해야 합니다.",
      },
      studyroom_id: {
        type: "integer",
        example: 1,
      },
    },
  },
};

module.exports = todoSchema;
