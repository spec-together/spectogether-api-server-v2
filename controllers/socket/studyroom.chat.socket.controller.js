const {
  validateonlyStudyroomIdSchemaService,
  validateStudyroomIdAndContentSchemaService,
} = require("../../services/socket/studyroom.chat.socket.validation.service");
const {
  getStudyroomChatByStudyroomIdService,
  saveChatToDatabaseService,
} = require("../../services/socket/studyroom.chat.socket.service");
const logger = require("../../logger");
const { decrypt62, encrypt62 } = require("../../services/encrypt.service");
const { socketErrorHandler } = require("../../handlers/socket.handlers");

const handleOnUserEnterStudyroomMessage = async (socket, data) => {
  try {
    logger.debug(
      `[handleOnUserEnterStudyroomMessage] Received: ${JSON.stringify(data, null, 2)}`
    );
    validateonlyStudyroomIdSchemaService(data);
    const { studyroom_id } = data;
    const { user_id } = socket.user;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    const studyroomChat = await getStudyroomChatByStudyroomIdService(
      decryptedStudyroomId,
      user_id
    );
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
    // const broadcastData = {
    //   sender_id: encrypt62(socket.user.user_id),
    //   sender_name: socket.user.name,
    //   sender_nickname: socket.user.nickname,
    //   sender_profile_image: socket.user.profile_image,
    //   type,
    //   content,
    //   created_at: new Date(),
    // };
    // if (type === "text") {
    //   socket.broadcast
    //     .to(decryptedStudyroomId)
    //     .emit("message-text", { ...broadcastData, is_my_chat: false });
    //   socket.emit("message-text", { ...broadcastData, is_my_chat: true });
    // } else if (type === "image") {
    //   socket.broadcast
    //     .to(decryptedStudyroomId)
    //     .emit("message-image", { ...broadcastData, is_my_chat: false });
    //   socket.emit("message-image", { ...broadcastData, is_my_chat: true });
    // }
    const newChat = await saveChatToDatabaseService(
      decryptedStudyroomId,
      socket.user.user_id,
      type,
      content
    );
    const broadcastData = {
      studyroom_chat_id: newChat.studyroom_chat_id,
      studyroom_id: newChat.studyroom_id,
      sender_id: encrypt62(newChat.sender_id),
      sender_name: socket.user.name,
      sender_nickname: socket.user.nickname,
      sender_profile_image: socket.user.profile_image,
      type: newChat.type,
      content: newChat.content,
      created_at: newChat.created_at,
    };
    if (type === "text") {
      socket.broadcast
        .to(decryptedStudyroomId)
        .emit("message-text", { ...broadcastData, is_my_chat: false });
      socket.emit("message-text", { ...broadcastData, is_my_chat: true });
    } else if (type === "image") {
      socket.broadcast
        .to(decryptedStudyroomId)
        .emit("message-image", { ...broadcastData, is_my_chat: false });
      socket.emit("message-image", { ...broadcastData, is_my_chat: true });
    }
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
