const logger = require("../logger");
const {
  UserTerm,
  UserStudyroom,
  Todo,
  TodoMember,
  UserSpec,
  Spec,
} = require("../models");

const getAgreedTermsByUserId = async (userId) => {
  const terms = await UserTerm.findAll({
    where: {
      user_id: userId,
    },
  });

  return terms;
};

const getUserStudyroomByUserId = async (userId) => {
  const userStudyroom = await UserStudyroom.findAll({
    where: {
      user_id: userId,
    },
  });

  return userStudyroom;
};

const getUserTodoByUserId = async (userId) => {
  const todos = await Todo.findAll({
    attributes: [
      "todo_id",
      "title",
      "subtitle",
      "content",
      "creater_id",
      "deadline",
      "status",
      "created_at",
    ],
    include: [
      {
        model: TodoMember,
        where: { assigned_user_id: userId },
        attributes: ["status"], // TodoMember의 속성을 포함하지 않으려면 빈 배열
      },
    ],
    // 필요한 경우 정렬, 페이징 등을 추가할 수 있습니다.
    // order: [['deadline', 'ASC']],
    // limit: 10,
    // offset: 0,
  });
  logger.debug(
    `[getUserTodoByUserId] userId: ${userId}, todos: ${JSON.stringify(todos, null, 2)}`
  );

  return todos;
};

const getUserSpecsByUserId = async (userId) => {
  const userSpecs = await UserSpec.findAll({
    where: { user_id: userId },
    attributes: [],
    include: [
      {
        model: Spec,
        attributes: ["spec_id", "title"],
        required: false, // LEFT OUTER JOIN 수행
      },
    ],
  });

  return userSpecs;
};

module.exports = {
  getAgreedTermsByUserId,
  getUserStudyroomByUserId,
  getUserTodoByUserId,
  getUserSpecsByUserId,
};
