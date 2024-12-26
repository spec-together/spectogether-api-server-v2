const logger = require("../../logger");
const { encrypt62, decrypt62 } = require("../../utils/encrypt.util");
const profileService = require("../../services/users/profile.users.service");
const { logError } = require("../../utils/handlers/error.logger");

exports.handleGetUserSpecs = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserSpecs] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const userSpecs = await profileService.getUserSpecsByUserId(user_id);
    return res.status(200).success({
      specs: userSpecs,
    });
  } catch (error) {
    logError(error);
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
      await profileService.getUserNeighborhoodsByUserId(user_id);
    return res.status(200).success({
      areas: userNeighborhoods,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

exports.handleGetUserMyProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetUserMyProfile] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    await profileService.checkIfUserExistsByUserId(user_id);
    const user = await profileService.getUserMyProfile(user_id);
    const neighborhoods =
      await profileService.getUserNeighborhoodsByUserId(user_id);
    const specs = await profileService.getUserSpecsByUserId(user_id);
    user.areas = neighborhoods;
    user.specs = specs;
    user.user_id = encrypt62(user.user_id);
    return res.status(200).success({
      user: user,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

exports.handleGetOtherUserProfile = async (req, res, next) => {
  try {
    logger.info(
      `[handleGetOtherUserProfile] req.params : ${JSON.stringify(req.params, null, 2)}`
    );
    const { user_id } = req.params;
    await profileService.checkIfUserExistsByUserId(decrypt62(user_id));
    const user = await profileService.getOtherUserProfile(decrypt62(user_id));
    return res.status(200).success({
      user: user,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
