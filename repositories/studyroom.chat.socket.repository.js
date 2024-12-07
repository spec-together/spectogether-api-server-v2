const { StudyroomChat } = require("../models");

const getStudyroomChatByStudyroomId = async (studyroomId) => {
  const chats = await StudyroomChat.findAll({
    attributes: [
      "studyroom_chat_id",
      "studyroom_id",
      "sender_id",
      "type",
      "content",
      "created_at",
    ],
    where: {
      studyroom_id: studyroomId,
    },
  });

  return chats;
};

module.exports = {
  getStudyroomChatByStudyroomId,
};
