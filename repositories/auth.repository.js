const logger = require("../logger");
const {
  User,
  Calendar,
  Todo,
  Sequelize,
  EmailVerificationCode,
  UserCalendar,
  UserRefreshToken,
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

const getUserByPhoneNumber = async (phoneNumber) => {
  logger.debug(`[getUserByPhoneNumber] 찾을 전화번호 : ${phoneNumber}`);
  const user = await User.findOne({
    attributes: ["user_id", "name", "nickname", "password"],
    where: {
      phone_number: phoneNumber,
    },
  });
  logger.debug(
    `[getUserByPhoneNumber] 전화번호로 사용자를 검색했습니다 : ${JSON.stringify(user, null, 2)}`
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

const removeRefreshTokenFromDatabaseByUserId = async (userId) => {
  const result = await UserRefreshToken.destroy({
    where: {
      user_id: userId,
    },
  });
  logger.debug(
    `[removeRefreshTokenFromDatabaseByUserId] 사용자의 리프레시 토큰을 삭제합니다: ${result} 개 삭제되었습니다.`
  );

  return result;
};

const removeRefreshTokenFromDatabaseByTokenString = async (tokenString) => {
  const result = await UserRefreshToken.destroy({
    where: {
      refresh_token: tokenString,
    },
  });
  logger.debug(
    `[removeRefreshTokenFromDatabaseByTokenString] 사용자의 리프레시 토큰을 삭제합니다: ${result}개 삭제되었습니다.`
  );

  return result;
};

const checkIfRefreshTokenExistsByTokenString = async (tokenString) => {
  const token = await UserRefreshToken.findOne({
    where: {
      refresh_token: tokenString,
    },
  });
  logger.debug(
    `[checkRefreshTokenExists] 리프레시 토큰이 존재하는지 확인합니다: ${JSON.stringify(
      token,
      null,
      2
    )}`
  );

  return token;
};

module.exports = {
  createNewUser,
  createNewCalendar,
  createNewTodo,
  connectUserWithCalendar,
  getUserByEmailOrPhoneNumber,
  getEmailByEmailVerificationId,
  getUserByPhoneNumber,
  removeRefreshTokenFromDatabaseByUserId,
  removeRefreshTokenFromDatabaseByTokenString,
  checkIfRefreshTokenExistsByTokenString,
};
