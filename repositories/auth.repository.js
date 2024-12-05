const { User, Calendar, Todo } = require("../models");

// ** 중요 **
// 데이터 검증은 service 단에서 완료가 되었어야 합니다.

const createNewUser = async (user) => {
  const newUser = await User.create(user);

  return newUser;
};

const createNewCalendar = async (calendar) => {
  const newCalendar = await Calendar.create(calendar);

  return newCalendar;
};

const createNewTodo = async (todo) => {
  const newTodo = await Todo.create(todo);

  return newTodo;
};

const connectUserWithCalendar = async (userId, calendarId) => {
  const result = await user_calendar.create({
    user_id: userId,
    calendar_id: calendarId,
  });

  return result;
};

const connectUserWithTodo = async (userId, todoId) => {
  const result = await user_todo.create({
    user_id: userId,
    todo_id: todoId,
  });

  return result;
};

module.exports = {
  createNewUser,
  createNewCalendar,
  createNewTodo,
  connectUserWithCalendar,
  connectUserWithTodo,
};
