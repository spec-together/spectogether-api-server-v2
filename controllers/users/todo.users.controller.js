const logger = require("../../logger");
const todoService = require("../../services/users/todo.users.service");
const { logError } = require("../../utils/handlers/error.logger");

exports.handleGetTodoInfo = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetTodoInfo] req.params : ${JSON.stringify(req.params, null, 2)}`
    );
    const { todo_id } = req.params;
    const todo = await todoService.getTodoInfo(todo_id);
    const members = await todoService.getTodoAssignedUserNumber(todo_id);
    return res.status(200).success({
      info: todo.dataValues,
      assigned_member: members,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

exports.handleGetUserTodos = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserTodos] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userTodos = await todoService.getUserTodo(user_id);
    return res.status(200).success({
      todos: userTodos,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
