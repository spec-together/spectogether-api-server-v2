const logger = require("../logger");
const {
  updateUserNicknameByUserId,
  checkIfUserExistsByUserId,
} = require("../repositories/users.repository");
const { encrypt62, decrypt62 } = require("../services/encrypt.service");
const {
  getUserAgreedTermsService,
  getUserTodoService,
  getUserStudyroomService,
  getUserSpecsByUserIdService,
  getUserNeighborhoodsByUserIdService,
  getUserMyProfileService,
  getOtherUserProfileService,
  editUserInfoService,
  checkIfUserExistsByUserIdService,
} = require("../services/users.service");
const {
  validateEditUserInfoSchemaService,
} = require("../services/users.validation.service");

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

const handleGetUserSpecs = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserSpecs] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userSpecs = await getUserSpecsByUserIdService(user_id);
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

const handleGetUserNeighborhoods = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserNeighborhoods] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userNeighborhoods =
      await getUserNeighborhoodsByUserIdService(user_id);
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

const handleGetUserMyProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserMyProfile] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    await checkIfUserExistsByUserIdService(user_id);
    const user = await getUserMyProfileService(user_id);
    const neighborhoods = await getUserNeighborhoodsByUserIdService(user_id);
    const specs = await getUserSpecsByUserIdService(user_id);
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

const handleGetOtherUserProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetOtherUserProfile] req.params : ${JSON.stringify(req.params, null, 2)}`
    );
    const { user_id } = req.params;
    await checkIfUserExistsByUserIdService(user_id);
    const user = await getOtherUserProfileService(decrypt62(user_id));
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

const handleEditUserInfo = async (req, res, next) => {
  try {
    logger.info(
      `[handleEditUserInfo] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    await checkIfUserExistsByUserIdService(user_id);
    validateEditUserInfoSchemaService(req.body);
    const { type, content } = req.body;
    await editUserInfoService(user_id, type, content);
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

module.exports = {
  handleGetUsersAgreedTerm,
  handleGetUserStudyrooms,
  handleGetUserTodos,
  handleGetUserSpecs,
  handleGetUserNeighborhoods,
  handleGetUserMyProfile,
  handleGetOtherUserProfile,
  handleEditUserInfo,
};
