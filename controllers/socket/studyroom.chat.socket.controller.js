const validator = require("../../utils/validators/studyroom.chat.socket.validators");
const chatService = require("../../services/socket/studyroom.chat.socket.service");
const logger = require("../../logger");
const { decrypt62, encrypt62 } = require("../../utils/encrypt.util");
const { socketErrorHandler } = require("../../utils/handlers/socket.handlers");

const userEnter = async (socket, data) => {
  try {
    logger.debug(`[userEnter] Received: ${JSON.stringify(data, null, 2)}`);
    // 1. 입력값 검증
    validator.userEnter(data);
    // 2-1. studyroom_id 복호화
    const decryptedStudyroomId = decrypt62(data.studyroom_id);

    // 3. 해당 studyroom_id의 채팅을 가져옴
    const data = await chatService.getChatByCursor({
      studyroom_id: decryptedStudyroomId,
    });
    // 가져온 채팅 로깅
    logger.debug(
      `[userEnter] studyroomChat: ${data.chats.length}개의 채팅
      \n${JSON.stringify(data.chats, null, 2)}`
    );

    // 4. 가져온 채팅을 initial-message 로 전송
    socket.emit("initial-message", data);
  } catch (error) {
    logger.error(`[userEnter] Error: ${error}`);
    socketErrorHandler(socket, "user-enter", error);
  }
};

// TODO : socket.io middleware의 정보 갱신 주기?
const userJoin = async (socket, data) => {
  try {
    logger.debug(`[userJoin] Received: ${JSON.stringify(data, null, 2)}`);
    validator.userEnter(data);
    const { studyroom_id } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    socket.join(decryptedStudyroomId);
    logger.debug(`[userJoin] Joined studyroom_id: ${decryptedStudyroomId}`);
    socket.broadcast
      .to(decryptedStudyroomId)
      .emit("user-joined", { user: socket.user });
  } catch (error) {
    logger.error(`[userJoin] Error: ${error}`);
    socketErrorHandler(socket, "user-join", error);
  }
};

// TODO : service로의 분리 필요
//      : user가 존재하는지 확인할 필요 있음
const userLeave = async (socket, data) => {
  try {
    logger.debug(`[userLeave] Received: ${JSON.stringify(data, null, 2)}`);
    validator.userEnter(data);
    const { studyroom_id } = data;
    const decryptedStudyroomId = decrypt62(studyroom_id);
    socket.leave(decryptedStudyroomId);
    logger.debug(`[userLeave] Left studyroom_id: ${decryptedStudyroomId}`);
    socket.broadcast
      .to(decryptedStudyroomId)
      .emit("user-left", { user: socket.user });
  } catch (error) {
    logger.error(`[userLeave] Error: ${error}`);
    socketErrorHandler(socket, "user-leave", error);
  }
};

const onMessage = async (socket, data) => {
  try {
    logger.debug(`[onMessage] Received: ${JSON.stringify(data, null, 2)}`);
    validator.message(data);
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
    const newChat = await chatService.saveChat(
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
    logger.error(`[onMessage] Error: ${error}`);
    socketErrorHandler(socket, "onMessage", error);
  }
};

module.exports = {
  userEnter,
  userJoin,
  userLeave,
  onMessage,
};
