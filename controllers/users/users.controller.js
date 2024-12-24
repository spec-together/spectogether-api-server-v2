const logger = require("../../logger");
const { encrypt62, decrypt62 } = require("../../utils/encrypt.util");
const userService = require("../../services/users/users.service");
const {
  validateEditUserInfoSchemaService,
} = require("../../utils/validators/users.validators");

exports.handleGetUsersAgreedTerm = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUsersAgreedTerm] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userAgreedTerms = await userService.getUserAgreedTerms(user_id);
    return res.status(200).success({
      terms: userAgreedTerms,
    });
  } catch (error) {
    logger.error(
      `[handleGetUsersAgreedTerm]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetTodoInfo = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetTodoInfo] req.params : ${JSON.stringify(req.params, null, 2)}`
    );
    const { todo_id } = req.params;
    const todo = await userService.getTodoInfo(todo_id);
    const members = await userService.getTodoAssignedUserNumber(todo_id);
    return res.status(200).success({
      info: todo.dataValues,
      assigned_member: members,
    });
  } catch (error) {
    logger.error(
      `[handleGetTodoInfo]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetUserStudyrooms = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserStudyrooms] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userStudyrooms = await userService.getUserStudyroom(user_id);
    return res.status(200).success({
      studyrooms: userStudyrooms,
    });
  } catch (error) {
    logger.error(
      `[handleGetUserStudyrooms]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetUserTodos = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserTodos] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userTodos = await userService.getUserTodo(user_id);
    return res.status(200).success({
      todos: userTodos,
    });
  } catch (error) {
    logger.error(
      `[handleGetUserTodos]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetUserSpecs = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserSpecs] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userSpecs = await userService.getUserSpecsByUserId(user_id);
    return res.status(200).success({
      specs: userSpecs,
    });
  } catch (error) {
    logger.error(
      `[handleGetUserSpecs]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetUserNeighborhoods = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserNeighborhoods] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userNeighborhoods =
      await userService.getUserNeighborhoodsByUserId(user_id);
    return res.status(200).success({
      neighborhoods: userNeighborhoods,
    });
  } catch (error) {
    logger.error(
      `[handleGetUserNeighborhoods]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetUserMyProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserMyProfile] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    await userService.checkIfUserExistsByUserId(user_id);
    const user = await userService.getUserMyProfile(user_id);
    const neighborhoods = await userService.getUserNeighborhoodsByUserId(user_id);
    const specs = await userService.getUserSpecsByUserId(user_id);
    user.dataValues.neighborhoods = neighborhoods;
    user.dataValues.specs = specs;
    user.dataValues.user_id = encrypt62(user.dataValues.user_id);
    return res.status(200).success({
      user,
    });
  } catch (error) {
    logger.error(
      `[handleGetUserMyProfile]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleGetOtherUserProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetOtherUserProfile] req.params : ${JSON.stringify(req.params, null, 2)}`
    );
    const { user_id } = req.params;
    await userService.checkIfUserExistsByUserId(user_id);
    const user = await userService.getOtherUserProfile(decrypt62(user_id));
    return res.status(200).success({
      user,
    });
  } catch (error) {
    logger.error(
      `[handleGetOtherUserProfile]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};

exports.handleEditUserInfo = async (req, res, next) => {
  try {
    logger.info(
      `[handleEditUserInfo] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    await userService.checkIfUserExistsByUserId(user_id);
    validateEditUserInfoSchemaService(req.body);
    const { type, content } = req.body;
    await userService.editUserInfo(user_id, type, content);
    return res.status(200).success({
      message: "정보가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    logger.error(
      `[handleEditUserInfo]\
      \nNAME ${error.name}\
      \nREASON ${JSON.stringify(error.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(error.message, null, 2)}\
      \nSTACK ${error.stack}`
    );
    next(error);
  }
};