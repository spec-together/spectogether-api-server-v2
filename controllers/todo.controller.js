// controllers/todo.controller.js
const todoService = require("../services/todo.service");

exports.handleCreateTodo = async (req, res, next) => {
  try {
    const { deadline, subtitle, content } = req.body;
    if (!deadline || !subtitle || !content) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "인증 정보가 필요합니다." });
    } // TODO : 에러 생성은 서비스 레이어로 이동

    const todoData = {
      ...req.body,
      creater_id: req.user.user_id,
    };
    const newTodo = await todoService.createTodo(todoData);
    return res.status(201).json({ todo: newTodo });
  } catch (error) {
    next(error);
  }
};

exports.handleGetAllTodos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await todoService.getAllTodos(page, limit);
    const { todos, pagination } = result;

    return res.status(200).success({
      todos,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.handleGetTodoById = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const todo = await todoService.getTodoById(todoId);
    return res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
};

exports.handleUpdateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const updateData = req.body;
    const updatedTodo = await todoService.updateTodo(todoId, updateData);
    return res.status(200).json({ todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

exports.handleDeleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    await todoService.deleteTodo(todoId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
