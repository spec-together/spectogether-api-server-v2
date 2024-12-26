const { DatabaseError } = require("../../errors");
const logger = require("../../logger");
const db = require("../../models");

exports.editUserEmail = async (userInfo) => {
  const { userId, email } = userInfo;
  logger.debug(`[editUserEmail] userId: ${userId}, email: ${email}`);
  const [updatedCount] = await db.User.update(
    { email },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 이메일과 동일해 수정되지 않았습니다.");
  }
  return { updatedCount };
};

exports.editUserProfileImage = async (userInfo) => {
  const { userId, profileImage } = userInfo;
  logger.debug(
    `[editUserProfileImage] userId: ${userId}, profileImage: ${profileImage}`
  );
  const [updatedCount] = await db.User.update(
    { profile_image: profileImage },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 프로필 이미지와 동일해 수정되지 않았습니다.");
  }
  return { updatedCount };
};

exports.editUserNickname = async (userInfo) => {
  const { userId, nickname } = userInfo;
  logger.debug(`[editUserNickname] userId: ${userId}, nickname: ${nickname}`);
  const [updatedCount] = await db.User.update(
    {
      nickname: nickname,
    },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 닉네임과 동일해 수정되지 않았습니다.");
  }
  return updatedCount;
};
