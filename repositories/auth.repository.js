const logger = require("../logger");
const {
  User,
  Calendar,
  Todo,
  Sequelize,
  EmailVerificationCode,
  UserCalendar,
} = require("../models");

// ** 중요 **
// 데이터 검증은 service 단에서 완료가 되었어야 합니다.

const createNewUser = async (user) => {
  const newUser = await User.create(user);
  logger.debug(
    `[createNewUser] created user: ${JSON.stringify(newUser, null, 2)}`
  );
  return newUser;
};

const createNewCalendar = async () => {
  const newCalendar = await Calendar.create();
  logger.debug(
    `[createNewCalendar] created calendar: ${JSON.stringify(newCalendar, null, 2)}`
  );

  return newCalendar;
};

const createNewTodo = async (todo) => {
  const newTodo = await Todo.create(todo);
  logger.debug(
    `[createNewTodo] created todo: ${JSON.stringify(newTodo, null, 2)}`
  );

  return newTodo;
};

const connectUserWithCalendar = async (userId, calendarId) => {
  const result = await UserCalendar.create({
    user_id: userId,
    calendar_id: calendarId,
  });
  logger.debug(
    `[connectUserWithCalendar] connected user and calendar: ${JSON.stringify(
      result,
      null,
      2
    )}`
  );

  return result;
};

const getUserByEmailOrPhoneNumber = async (email, phoneNumber) => {
  logger.debug(
    `[getUserByEmailOrPhoneNumber] email: ${email}, phoneNumber: ${phoneNumber}`
  );
  const user = await User.findOne({
    where: {
      [Sequelize.Op.or]: [{ email }, { phone_number: phoneNumber }],
    },
  });
  logger.debug(
    `[getUserByEmailOrPhoneNumber] found user: ${JSON.stringify(user, null, 2)}`
  );

  return user;
};

const getEmailByEmailVerificationId = async (id) => {
  const result = await EmailVerificationCode.findByPk(id);
  logger.debug(
    `[getEmailByEmailVerificationId] 인증에 실제로 사용되었던 이메일인지 확인합니다: ${JSON.stringify(
      result,
      null,
      2
    )}`
  );

  return result;
};

module.exports = {
  createNewUser,
  createNewCalendar,
  createNewTodo,
  connectUserWithCalendar,
  getUserByEmailOrPhoneNumber,
  getEmailByEmailVerificationId,
};
