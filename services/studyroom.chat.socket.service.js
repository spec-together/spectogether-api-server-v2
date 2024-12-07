const logger = require("../logger");
const {
  getStudyroomChatByStudyroomId,
} = require("../repositories/studyroom.chat.socket.repository");

const getStudyroomChatByStudyroomIdService = async (studyroomId) => {
  const chats = await getStudyroomChatByStudyroomId(studyroomId);
  if (!chats) {
    throw new NotExistsError("해당 스터디룸의 채팅이 없습니다.");
  }
  logger.debug(
    `[getStudyroomChatByStudyroomIdService] 해당 스터디룸의 채팅을 가져옵니다: ${JSON.stringify(chats, null, 2)}`
  );

  return chats;
};

getStudyroomChatByStudyroomIdService(1)
  .then((result) => {
    console.log({ result: result });
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = {
  getStudyroomChatByStudyroomIdService,
};
