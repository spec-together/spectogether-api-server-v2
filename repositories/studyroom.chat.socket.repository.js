const logger = require("../logger");
const { StudyroomChat, StudyroomMember, User } = require("../models");

const getStudyroomChatByStudyroomId = async (studyroomId) => {
  const chats = await StudyroomChat.findAll({
    include: [
      {
        model: User,
        attributes: ["name", "nickname", "profile_image"],
        required: false,
      },
    ],
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

  logger.debug(
    `[getStudyroomChatByStudyroomId] studyroomId: ${studyroomId}, chats: ${JSON.stringify(
      chats,
      null,
      2
    )}`
  );

  return chats;
};

const checkIfUserInStudyroom = async (studyroomId, userId) => {
  const studyroomChat = await StudyroomMember.findOne({
    attributes: ["studyroom_id"],
    where: {
      studyroom_id: studyroomId,
      sender_id: userId,
    },
  });

  return studyroomChat;
};

const saveChatToDatabase = async (studyroomId, senderId, type, content) => {
  const chat = await StudyroomChat.create({
    studyroom_id: studyroomId,
    sender_id: senderId,
    type,
    content,
  });

  return chat;
};

module.exports = {
  getStudyroomChatByStudyroomId,
  checkIfUserInStudyroom,
  saveChatToDatabase,
};
