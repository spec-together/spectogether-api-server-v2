const logger = require("../../logger");
const userService = require("../../services/users/users.service");

const { logError } = require("../../utils/handlers/error.logger");

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
    logError(error);
    next(error);
  }
};
