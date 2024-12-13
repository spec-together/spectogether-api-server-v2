// repositories/todo.repository.js
const { Todo, TodoMember, StudyroomTodo } = require("../models");
const { NotExistsError } = require("../errors");

const createTodo = async (todoData) => {
  return await Todo.create(todoData);
};

const getAllTodos = async (limit, offset) => {
  const { rows, count } = await Todo.findAndCountAll({
    limit,
    offset,
    include: [
      { model: TodoMember, required: false },
      { model: StudyroomTodo, required: false },
    ], // TODO : required : false ? 검토
    order: [["created_at", "DESC"]],
  });
  return { todos: rows, count };
};

const getTodoById = async (id) => {
  const todo = await Todo.findByPk(id, {
    include: [TodoMember, StudyroomTodo],
  });
  if (!todo) {
    throw new NotExistsError("Todo를 찾을 수 없습니다.");
  }
  return todo;
};

const updateTodo = async (id, updateData) => {
  const todo = await Todo.findByPk(id);
  if (!todo) {
    throw new NotExistsError("Todo를 찾을 수 없습니다.");
  }
  return await todo.update(updateData);
};

const deleteTodo = async (id) => {
  const todo = await Todo.findByPk(id);
  if (!todo) {
    throw new NotExistsError("Todo를 찾을 수 없습니다.");
  }
  await todo.destroy();
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
