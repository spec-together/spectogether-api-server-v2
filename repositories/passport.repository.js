const { User, KakaoUserInfo } = require("../models");

const getUserByUserId = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["user_id", "name", "nickname"],
  });

  return user;
};

const getUserbyEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  return user;
};

const saveKakaoUserInfo = async (data) => {
  const user = await KakaoUserInfo.create(data);

  return user;
};

module.exports = {
  getUserByUserId,
  getUserbyEmail,
  saveKakaoUserInfo,
};
