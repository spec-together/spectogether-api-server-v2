const chatController = require("../../controllers/socket/studyroom.chat.socket.controller");
const logger = require("../../logger");

const socketMiddleware = require("../../middleware/socket.authenticate.jwt");

const socketRouter = (io) => {
  logger.debug(`[studyroomChatSocketRouter] Loaded`);

  io.use(socketMiddleware.checkAccessToken);

  io.on("connection", (socket) => {
    socket.on(
      "user-entered",
      async (data) => await chatController.userEnter(socket, data)
    );
    socket.on(
      "user-join",
      async (data) => await chatController.userJoin(socket, data)
    );
    socket.on(
      "user-leave",
      async (data) => await chatController.userLeave(socket, data)
    );
    socket.on(
      "message",
      async (data) => await chatController.onMessage(socket, data)
    );

    // socket.on("reconnect");
    socket.on(
      "disconnect",
      async (data) => await chatController.onDisconnect(socket, data)
    );
  });
};

module.exports = socketRouter;

/**
 * @swagger
 * tags:
 *   name: chat socket.io
 *   description: 채팅을 위한 socket.io 이벤트 처리
 *
 * components:
 *   schemas:
 *     UserEntered:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 스터디룸에 입장한 사용자의 ID.
 *         roomId:
 *           type: string
 *           description: 스터디룸의 ID.
 *       required:
 *         - userId
 *         - roomId
 *
 *     UserJoin:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 채팅룸에 참여하는 사용자의 ID.
 *         roomId:
 *           type: string
 *           description: 채팅룸의 ID.
 *       required:
 *         - userId
 *         - roomId
 *
 *     UserLeave:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 채팅룸을 떠나는 사용자의 ID.
 *         roomId:
 *           type: string
 *           description: 채팅룸의 ID.
 *       required:
 *         - userId
 *         - roomId
 *
 *     Message:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 메시지를 보내는 사용자의 ID.
 *         roomId:
 *           type: string
 *           description: 채팅룸의 ID.
 *         content:
 *           type: string
 *           description: 메시지 내용.
 *       required:
 *         - userId
 *         - roomId
 *         - content
 *
 * /chat/connect:
 *   post:
 *     summary: socket.io 서버에 연결합니다.
 *     tags: [chat socket.io]
 *     responses:
 *       200:
 *         description: socket.io에 성공적으로 연결되었습니다.
 *       401:
 *         description: 권한이 없습니다.
 *
 * /chat/user-entered:
 *   post:
 *     summary: 사용자가 스터디룸에 입장할 때 발생하는 이벤트를 처리합니다.
 *     tags: [chat socket.io]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEntered'
 *     responses:
 *       200:
 *         description: 사용자 입장이 성공적으로 처리되었습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 *
 * /chat/user-join:
 *   post:
 *     summary: 사용자가 채팅룸에 참여할 때 발생하는 이벤트를 처리합니다.
 *     tags: [chat socket.io]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserJoin'
 *     responses:
 *       200:
 *         description: 사용자가 채팅룸에 성공적으로 참여했습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 *
 * /chat/user-leave:
 *   post:
 *     summary: 사용자가 채팅룸을 떠날 때 발생하는 이벤트를 처리합니다.
 *     tags: [chat socket.io]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLeave'
 *     responses:
 *       200:
 *         description: 사용자가 채팅룸을 성공적으로 떠났습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 *
 * /chat/message:
 *   post:
 *     summary: 사용자가 채팅룸에서 메시지를 보낼 때 발생하는 이벤트를 처리합니다.
 *     tags: [chat socket.io]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: 메시지가 성공적으로 전송되었습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
