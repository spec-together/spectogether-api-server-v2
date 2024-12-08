const {
  validateonlyStudyroomIdSchemaService,
  validateStudyroomIdAndContentSchemaService,
} = require("../../services/socket/studyroom.chat.socket.validation.service");
const {
  getStudyroomChatByStudyroomIdService,
  saveChatToDatabaseService,
} = require("../../services/socket/studyroom.chat.socket.service");
const logger = require("../../logger");
const { decrypt62 } = require("../../services/encrypt.service");
const { socketErrorHandler } = require("../../handlers/socket.handlers");

const handleOnUserEnterStudyroomMessage = async (socket, data) => {
  try {
    logger.debug(
      `[handleOnUserEnterStudyroomMessage] Received: ${JSON.stringify(data, null, 2)}`
    );
    validateonlyStudyroomIdSchemaService(data);
    const { studyroom_id } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    const studyroomChat =
      await getStudyroomChatByStudyroomIdService(decryptedStudyroomId);
    logger.debug(
      `[handleOnUserEnterStudyroomMessage] studyroomChat: ${JSON.stringify(studyroomChat, null, 2)}`
    );
    socket.emit("initial-message", { chats: studyroomChat });
  } catch (error) {
    logger.error(`[handleOnUserEnterStudyroomMessage] Error: ${error}`);
    socketErrorHandler(socket, "handleOnUserEnterStudyroomMessage", error);
  }
};

// TODO : socket.io middleware의 정보 갱신 주기?
const handleOnJoinChatroom = async (socket, data) => {
  try {
    logger.debug(
      `[handleOnJoinChatroom] Received: ${JSON.stringify(data, null, 2)}`
    );
    validateonlyStudyroomIdSchemaService(data);
    const { studyroom_id } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    socket.join(decryptedStudyroomId);
    logger.debug(
      `[handleOnJoinChatroom] Joined studyroom_id: ${decryptedStudyroomId}`
    );
    socket.broadcast
      .to(decryptedStudyroomId)
      .emit("user-joined", { user: socket.user });
  } catch (error) {
    logger.error(`[handleOnJoinChatroom] Error: ${error}`);
    socketErrorHandler(socket, "handleOnJoinChatroom", error);
  }
};

// TODO : service로의 분리 필요
//      : user가 존재하는지 확인할 필요 있음
const handleOnLeave = async (socket, data) => {
  try {
    logger.debug(`[handleOnLeave] Received: ${JSON.stringify(data, null, 2)}`);
    validateonlyStudyroomIdSchemaService(data);
    const { studyroom_id } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    socket.leave(decryptedStudyroomId);
    logger.debug(`[handleOnLeave] Left studyroom_id: ${decryptedStudyroomId}`);
    socket.broadcast
      .to(decryptedStudyroomId)
      .emit("user-left", { user: socket.user });
  } catch (error) {
    logger.error(`[handleOnLeave] Error: ${error}`);
    socketErrorHandler(socket, "handleOnLeave", error);
  }
};

const handleOnMessage = async (socket, data) => {
  try {
    logger.debug(
      `[handleOnMessage] Received: ${JSON.stringify(data, null, 2)}`
    );
    validateStudyroomIdAndContentSchemaService(data);
    const { studyroom_id, type, content } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    if (type === "text") {
      socket.broadcast
        .to(decryptedStudyroomId)
        .emit("message-text", { user: socket.user, content });
      socket.emit("message-text", { user: socket.user, content });
    } else if (type === "image") {
      socket.broadcast
        .to(decryptedStudyroomId)
        .emit("message-image", { user: socket.user, content });
    }
    await saveChatToDatabaseService(
      decryptedStudyroomId,
      socket.user.user_id,
      type,
      content
    );
  } catch (error) {
    logger.error(`[handleOnMessage] Error: ${error}`);
    socketErrorHandler(socket, "handleOnMessage", error);
  }
};

module.exports = {
  handleOnUserEnterStudyroomMessage,
  handleOnJoinChatroom,
  handleOnLeave,
  handleOnMessage,
};
