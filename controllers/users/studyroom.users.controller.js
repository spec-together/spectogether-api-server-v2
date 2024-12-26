const logger = require("../../logger");
const studyroomService = require("../../services/users/studyroom.users.service");

const { logError } = require("../../utils/handlers/error.logger");

exports.handleGetUserStudyrooms = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserStudyrooms] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userStudyrooms = await studyroomService.getUserStudyroom(user_id);
    return res.status(200).success({
      studyrooms: userStudyrooms,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
