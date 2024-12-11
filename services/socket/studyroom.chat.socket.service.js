const { NotAllowedError } = require("../../errors");
const logger = require("../../logger");
const {
  getStudyroomChatByStudyroomId,
  checkIfUserInStudyroom,
  saveChatToDatabase,
} = require("../../repositories/studyroom.chat.socket.repository");

const getStudyroomChatByStudyroomIdService = async (studyroomId) => {
  const chats = await getStudyroomChatByStudyroomId(studyroomId);
  if (!chats) {
    throw new NotExistsError("해당 스터디룸의 채팅이 없습니다.");
  }
  logger.debug(
    `[getStudyroomChatByStudyroomIdService] 해당 스터디룸의 채팅을 가져옵니다: ${JSON.stringify(chats, null, 2)}`
  );

  let ret = [];
  for (const chat of chats) {
    ret.push({
      studyroom_chat_id: chat.studyroom_chat_id,
      studyroom_id: chat.studyroom_id,
      sender_id: chat.sender_id,
      type: chat.type,
      content: chat.content,
      created_at: chat.created_at,
    });
  }

  return ret;
};

const checkIfUserInStudyroomService = async (studyroomId, userId) => {
  const result = checkIfUserInStudyroom(studyroomId, userId);
  if (!result) {
    throw new NotAllowedError("해당 스터디룸에 속한 사용자가 아닙니다.");
  }
  return result;
};

const saveChatToDatabaseService = async (
  studyroomId,
  senderId,
  type,
  content
) => {
  const result = await saveChatToDatabase(studyroomId, senderId, type, content);
  if (!result) {
    throw new InvalidInputError("채팅 저장에 실패했습니다.");
  }

  return result;
};

module.exports = {
  getStudyroomChatByStudyroomIdService,
  checkIfUserInStudyroomService,
  saveChatToDatabaseService,
};
