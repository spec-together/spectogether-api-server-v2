// services/todo.service.js
const todoRepository = require("../repositories/todo.repository");
const { InvalidInputError } = require("../errors");

const createTodo = async (todoData) => {
  // 추가적인 비즈니스 로직 가능
  return await todoRepository.createTodo(todoData);
};

const getAllTodos = async (page, limit) => {
  if (isNaN(page) || isNaN(limit)) {
    throw new InvalidInputError("유효한 페이지 정보가 아닙니다.");
  }
  const offset = (page - 1) * limit;
  const { todos, count } = await todoRepository.getAllTodos(limit, offset);
  const total_pages = Math.ceil(count / limit);

  return {
    todos,
    pagination: {
      total_items: count,
      total_pages,
      page: page,
      limit,
      next: page < total_pages ? `/todos?page=${page + 1}` : null,
      previous: page > 1 ? `/todos?page=${page - 1}` : null,
    },
  };
};

const getTodoById = async (id) => {
  return await todoRepository.getTodoById(id);
};

const updateTodo = async (id, updateData) => {
  return await todoRepository.updateTodo(id, updateData);
};

const deleteTodo = async (id) => {
  return await todoRepository.deleteTodo(id);
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
