// repositories/todo.repository.js
const { Todo, TodoMember, StudyroomTodo, Studyroom } = require("../models");

const createTodo = async (todoData) => {
  return await Todo.create(todoData);
};

const addTodoMember = async (todo_id, creater_id) => {
  return await TodoMember.create({
    todo_id,
    assigned_user_id: creater_id,
    status: "pending",
    comment: "",
    photo: "",
  });
};

const addStudyroomTodo = async (studyroom_id, todo_id) => {
  return await StudyroomTodo.create({
    studyroom_id,
    todo_id,
  });
};

const getAllTodos = async (limit, offset, studyroomId = null) => {
  const where = studyroomId ? {} : {};

  const { rows, count } = await Todo.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      {
        model: TodoMember,
        required: false,
        attributes: ["status"],
      },
      {
        model: Studyroom,
        required: studyroomId ? true : false,
        through: {
          where: studyroomId ? { studyroom_id: studyroomId } : {},
        },
        attributes: ["studyroom_id", "title"],
      },
    ],
    order: [["created_at", "DESC"]],
    distinct: true, // 중복 제거
  });

  return { todos: rows, count };
};

const getTodoById = async (id) => {
  const todo = await Todo.findByPk(id, {
    include: [
      {
        model: TodoMember,
        // as: "members",
      },
      {
        model: Studyroom,
        // as: "studyrooms",
      },
    ],
  });
  return todo; // 존재하지 않으면 null 반환
};

const updateTodo = async (id, updateData) => {
  const todo = await Todo.findByPk(id);
  if (!todo) {
    return null;
  }
  return await todo.update(updateData);
};

const deleteTodo = async (id) => {
  const todo = await Todo.findByPk(id);
  if (!todo) {
    return false; // 삭제할 todo가 없는 경우
  }
  await todo.destroy();
  return true;
};

const getStudyroomById = async (studyroom_id) => {
  const studyroom = await Studyroom.findByPk(studyroom_id);
  if (!studyroom) {
    throw new NotExistsError("스터디룸을 찾을 수 없습니다.");
  }
  return studyroom;
};

module.exports = {
  createTodo,
  addTodoMember,
  addStudyroomTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getStudyroomById,
};
