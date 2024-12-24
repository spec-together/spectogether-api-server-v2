const logger = require("../../logger");
const patchService = require("../../services/users/patch.users.service");

const { logError } = require("../../utils/handlers/error.logger");

exports.handleEditUserEmail = async (req, res, next) => {
  try {
    logger.info(
      `[handleEditUserEmail] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const { email } = req.body;
    await patchService.checkIfUserExistsByUserId(user_id);
    // validateEditUserInfoSchemaService(req.body);
    const userInfo = { userId: user_id, email };
    await patchService.editUserEmail(userInfo);
    return res.status(200).success({
      message: "이메일이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

exports.handleEditUserProfileImage = async (req, res, next) => {
  try {
    logger.info(
      `[handleEditUserProfileImage] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const { profileImage } = req.body;
    await patchService.checkIfUserExistsByUserId(user_id);
    // validateEditUserInfoSchemaService(req.body);
    const userInfo = { userId: user_id, profileImage };
    await patchService.editUserProfileImage(userInfo);
    return res.status(200).success({
      message: "프로필 이미지가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

exports.handleEditUserNickname = async (req, res, next) => {
  try {
    logger.info(
      `[handleEditUserNickname] req.user : ${JSON.stringify(req.user, null, 2)}`
    );
    const { user_id } = req.user;
    const { nickname } = req.body;
    await patchService.checkIfUserExistsByUserId(user_id);
    // validateEditUserInfoSchemaService(req.body);
    const userInfo = { userId: user_id, nickname };
    await patchService.editUserNickname(userInfo);
    return res.status(200).success({
      message: "닉네임이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
