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

    // 해당 사용자가 해당 스터디룸에 속해있는지 검증
    // if not, throws error
    await chatService.isUserInStudyroom({
      studyroom_id: decryptedStudyroomId,
      user_id: socket.user.user_id,
    });

    // 3. 해당 studyroom_id의 채팅을 가져옴
    const chatData = await chatService.getChatByCursor({
      studyroom_id: decryptedStudyroomId,
    });
    // 가져온 채팅 로깅
    logger.debug(
      `[userEnter] studyroomChat: ${chatData.chats.length}개의 채팅
      \n${JSON.stringify(chatData.chats, null, 2)}`
    );

    // 4. 가져온 채팅을 initial-message 로 전송
    socket.emit("initial-message", chatData);
  } catch (error) {
    logger.error(`[userEnter] Error: ${error}`);
    socketErrorHandler(socket, "user-enter", error);
  }
};

// TODO : socket.io middleware의 정보 갱신 주기?
const userJoin = async (socket, data) => {
  try {
    logger.debug(`[userJoin] Received: ${JSON.stringify(data, null, 2)}`);
    // 입력값 검증
    validator.userEnter(data);
    // studyroom_id 복호화
    const decryptedStudyroomId = decrypt62(data.studyroom_id);

    // 해당 사용자가 해당 스터디룸에 속해있는지 검증
    // if not, throws error
    await chatService.isUserInStudyroom({
      studyroom_id: decryptedStudyroomId,
      user_id: socket.user.user_id,
    });

    // studyroom_id로 해당 소켓 room join
    socket.join(decryptedStudyroomId);
    logger.debug(`[userJoin] Joined studyroom_id: ${decryptedStudyroomId}`);

    // 해당 room에 user-joined 이벤트 emit
    socket.broadcast.to(decryptedStudyroomId).emit("user-joined", {
      socket_id: socket.id,
      user_id: encrypt62(socket.user.user_id),
      name: socket.user.name,
      nickname: socket.user.nickname,
    });
  } catch (error) {
    logger.error(`[userJoin] Error: ${error}`);
    socketErrorHandler(socket, "user-join", error);
  }
};

// TODO : socket_id는 production에서 제외해야함
// 근데 user_id는 암호화해서 보내는거라 매번 달라지는데
// 그렇게 되면 socket_id로 구분하는게 front 입장에서 맞아보임 ..
const userLeave = async (socket, data) => {
  try {
    logger.debug(`[userLeave] Received: ${JSON.stringify(data, null, 2)}`);
    // 입력값 검증
    validator.userEnter(data);
    // studyroom_id 복호화
    const decryptedStudyroomId = decrypt62(data.studyroom_id);

    // leave는 굳이 해당 사용자가 해당 스터디룸에 속해있는지 검증할 필요 없음

    // 해당 socket을 room에서 leave
    socket.leave(decryptedStudyroomId);
    logger.debug(`[userLeave] Left studyroom_id: ${decryptedStudyroomId}`);

    // 해당 room에 user-left 이벤트 emit
    socket.broadcast.to(decryptedStudyroomId).emit("user-left", {
      socket_id: socket.id,
      user_id: encrypt62(socket.user.user_id),
      name: socket.user.name,
      nickname: socket.user.nickname,
    });
  } catch (error) {
    logger.error(`[userLeave] Error: ${error}`);
    socketErrorHandler(socket, "user-leave", error);
  }
};

const onMessage = async (socket, data) => {
  try {
    logger.debug(`[onMessage] Received: ${JSON.stringify(data, null, 2)}`);
    // 입력값 검증
    validator.message(data);
    // studyroom_id 복호화
    const decryptedStudyroomId = decrypt62(data.studyroom_id);

    // 해당 사용자가 해당 스터디룸에 속해있는지 검증
    // if not, throws error
    await chatService.isUserInStudyroom({
      studyroom_id: decryptedStudyroomId,
      user_id: socket.user.user_id,
    });

    // 채팅 저장
    const newChat = await chatService.saveChat(
      decryptedStudyroomId,
      socket.user.user_id,
      data.type,
      data.content
    );

    // 이미지를 전송할 경우, content에 url 추가

    // created_at이 current_timestamp라서
    // js에서는 알 방법이 없어서 Date.now()로 보내기
    // 어차피 다음 번엔 서버에서 받아서 처리할거라 상관 ㄴㄴ
    // console.log(newChat.created_at);

    // broadcast할 data 정의
    const broadcastData = {
      studyroom_chat_id: newChat.studyroom_chat_id,
      studyroom_id: newChat.studyroom_id,
      sender_id: encrypt62(newChat.sender_id),
      sender_name: socket.user.name,
      sender_nickname: socket.user.nickname,
      sender_profile_image: socket.user.profile_image,
      type: newChat.type,
      content: newChat.content,
      created_at: new Date().toISOString(),
    };

    // 해당 room에 message 이벤트 emit
    // 자기 자신에게도 emit (broadcast로 하면 자기 자신에게는 emit 안됨)
    socket.broadcast
      .to(decryptedStudyroomId)
      .emit("message", { ...broadcastData, is_my_chat: false });
    socket.emit("message", { ...broadcastData, is_my_chat: true });
  } catch (error) {
    logger.error(`[onMessage] Error: ${error}`);
    socketErrorHandler(socket, "onMessage", error);
  }
};

const onDisconnect = async (socket, data) => {
  try {
    logger.debug(`[onDisconnect] ID ${socket.id} Disconnected, Data : ${data}`);
  } catch (error) {
    logger.error(`[onDisconnect] Error: ${error}`);
    // disconnect 라서 에러 전송 핸들러는 안 붙였습니다.
  }
};

module.exports = {
  userEnter,
  userJoin,
  userLeave,
  onMessage,
  onDisconnect,
};
