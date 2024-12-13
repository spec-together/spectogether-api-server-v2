const todoService = require("../services/todo.service");

exports.handleCreateTodo = async (req, res, next) => {
  try {
    const { deadline, title, subtitle, content, studyroom_id } = req.body;
    const todoData = {
      deadline,
      title,
      subtitle,
      content,
      creater_id: req.user.user_id,
      status: "pending", // 기본 상태 설정
      studyroom_id, // 클라이언트로부터 studyroom_id를 받아 서비스 레이어에 전달해 사용.
    };
    const newTodo = await todoService.createTodoService(todoData);
    return res.status(201).success({ todo: newTodo });
  } catch (error) {
    next(error);
  }
};

exports.handleGetAllTodos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const studyroomId = req.query.studyroom_id;

    const result = await todoService.getAllTodosService(
      page,
      limit,
      studyroomId
    );
    return res.status(200).success({
      todos: result.todos,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.handleGetTodoById = async (req, res, next) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const todo = await todoService.getTodoByIdService(todoId);
    return res.status(200).success({ todo });
  } catch (error) {
    next(error);
  }
};

exports.handleUpdateTodo = async (req, res, next) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const updatedTodo = await todoService.updateTodoService(todoId, updateData);
    return res.status(200).success({ todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

exports.handleDeleteTodo = async (req, res, next) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    await todoService.deleteTodoService(todoId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
