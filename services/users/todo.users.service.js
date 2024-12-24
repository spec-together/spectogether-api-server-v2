const { NotExistsError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const db = require("../../models");

exports.getUserTodo = async (userId) => {
  const studyroomTodos = await db.StudyroomTodo.findAll({
    attributes: ["studyroom_id"],
    include: [
      {
        model: db.Todo,
        as: "todo",
        attributes: [
          "todo_id",
          "title",
          "content",
          "location",
          "status", // todo_status: "enum (pending, done, deleted)"
          "starts_at",
          "ends_at",
          "creater_id",
          "created_at",
          "updated_at",
        ],
        include: [
          {
            model: db.TodoParticipant,
            as: "todo_participants",
            where: { assigned_user_id: userId },
            attributes: ["assigned_user_id", "status"], // my_status: "enum (pending, abandoned, done)"
          },
        ],
      },
    ],
  });

  const userTodos = await db.UserTodo.findAll({
    where: { user_id: userId },
    attributes: ["todo_id"],
    include: [
      {
        model: db.Todo,
        as: "todo",
        attributes: [
          "todo_id",
          "title",
          "content",
          "location",
          "status",
          "starts_at",
          "ends_at",
          "creater_id",
          "created_at",
          "updated_at",
        ],
      },
    ],
  });

  const todos = [...studyroomTodos, ...userTodos].map((todoEntry) => {
    const isStudyroomTodo = !!todoEntry.studyroom_id;
    const todo = todoEntry.todo;

    return {
      type: isStudyroomTodo ? "studyroom" : "user",
      studyroom_id: isStudyroomTodo ? encrypt62(todoEntry.studyroom_id) : null,
      todo_id: todo?.todo_id,
      title: todo?.title,
      content: todo?.content,
      location: todo?.location,
      todo_status: todo?.status,
      my_status: isStudyroomTodo
        ? todo?.todo_participants?.[0]?.status || null
        : null,
      starts_at: todo?.starts_at,
      ends_at: todo?.ends_at,
      creater_id: todo?.creater_id,
      participants: isStudyroomTodo
        ? todo?.todo_participants?.map((participant) => ({
            id: participant.assigned_user_id,
            nickname: participant.nickname || null,
          })) || []
        : [],
      created_at: todo?.created_at,
      updated_at: todo?.updated_at,
    };
  });

  if (!todos.length) {
    throw new NotExistsError("해당 사용자의 할 일이 없습니다.");
  }

  return todos;
};

exports.getTodoInfo = async (todoId) => {
  const todo = await db.Todo.findByPk(todoId, {
    attributes: [
      "todo_id",
      "title",
      "content",
      "location",
      "status",
      "start_at",
      "ends_at",
      "creater_id",
    ],
    // include: [
    //   {
    //     model: TodoMember,
    //     attributes: ["status"],
    //   },
    // ],
  });
  if (!todo) {
    throw new NotExistsError("해당 할 일이 없습니다.");
  }

  return todo;
};

exports.getTodoAssignedUserNumber = async (todoId) => {
  const todo = await db.TodoParticipant.findAll({
    where: { todo_id: todoId },
    attributes: ["assigned_user_id", "status"],
  });
  if (!todo) {
    throw new NotExistsError("해당 todo에 배정된 사용자가 존재하지 않습니다.");
  }
  logger.debug(
    `[getTodoAssignedUserNumberService] 해당 할 일에 배정된 사용자 수: ${todo.length}`
  );

  return todo;
};
