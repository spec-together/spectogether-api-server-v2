const logger = require("../logger");
const {
  getUserAgreedTermsService,
  getUserTodoService,
} = require("../services/users.service");

const handleGetUsersAgreedTerm = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUsersAgreedTerm] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userAgreedTerms = await getUserAgreedTermsService(user_id);
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

const handleGetUserStudyrooms = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserStudyrooms] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userStudyrooms = await getUserStudyroomService(user_id);
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

const handleGetUserTodos = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserTodos] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userTodos = await getUserTodoService(user_id);
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

module.exports = {
  handleGetUsersAgreedTerm,
  handleGetUserStudyrooms,
  handleGetUserTodos,
};
