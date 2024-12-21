const studyroomSchema = {
  Studyroom: {
    type: "object",
    properties: {
      studyroom_id: {
        type: "integer",
        example: 1,
      },
      title: {
        type: "string",
        example: "프로그래밍 스터디",
      },
      subtitle: {
        type: "string",
        example: "JavaScript 심화",
      },
      area_id: {
        type: "integer",
        example: 2,
      },
      profile_image: {
        type: "string",
        example: "https://example.com/image.png",
      },
      target_type: {
        type: "string",
        example: "beginner",
      },
      target_id: {
        type: "integer",
        example: 3,
      },
      status: {
        type: "string",
        example: "active",
      },
      created_at: {
        type: "string",
        format: "date-time",
        example: "2024-01-01T00:00:00Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        example: "2024-01-02T00:00:00Z",
      },
    },
    required: [
      "studyroom_id",
      "title",
      "subtitle",
      "area_id",
      "profile_image",
      "target_type",
      "target_id",
      "status",
    ],
  },
};

module.exports = studyroomSchema;
