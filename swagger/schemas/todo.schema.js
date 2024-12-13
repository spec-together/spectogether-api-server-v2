// swagger/schemas/todo.schema.js
const TodoSchema = {
  Todo: {
    type: "object",
    properties: {
      todo_id: {
        type: "integer",
        example: 1,
      },
      title: {
        type: "string",
        example: "할 일 제목",
      },
      description: {
        type: "string",
        example: "할 일에 대한 상세 설명",
      },
      status: {
        type: "string",
        enum: ["pending", "in_progress", "completed"],
        example: "pending",
      },
      created_at: {
        type: "string",
        format: "date-time",
        example: "2023-10-10T10:00:00Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        example: "2023-10-10T12:00:00Z",
      },
      TodoMembers: {
        type: "array",
        items: {
          $ref: "#/components/schemas/TodoMember",
        },
      },
      StudyroomTodos: {
        type: "array",
        items: {
          $ref: "#/components/schemas/StudyroomTodo",
        },
      },
    },
    required: ["title", "status"],
  },
  TodoMember: {
    type: "object",
    properties: {
      todo_member_id: {
        type: "integer",
        example: 1,
      },
      todo_id: {
        type: "integer",
        example: 1,
      },
      user_id: {
        type: "integer",
        example: 2,
      },
      role: {
        type: "string",
        example: "assignee",
      },
    },
    required: ["todo_id", "user_id"],
  },
  StudyroomTodo: {
    type: "object",
    properties: {
      studyroom_todo_id: {
        type: "integer",
        example: 1,
      },
      todo_id: {
        type: "integer",
        example: 1,
      },
      studyroom_id: {
        type: "integer",
        example: 3,
      },
    },
    required: ["todo_id", "studyroom_id"],
  },
};

module.exports = TodoSchema;
