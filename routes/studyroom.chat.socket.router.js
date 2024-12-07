const {
  handleOnUserEnterStudyroomMessage,
  handleOnJoinChatroom,
  handleOnLeave,
  handleOnMessage,
} = require("../controllers/studyroom.chat.socket.controller");
const logger = require("../logger");
const {
  socketAuthenticateAccessToken,
} = require("../middleware/socket.authenticate.jwt");

const socketRouter = (io) => {
  logger.debug(`[studyroomChatSocketRouter] Loaded`);

  io.use(socketAuthenticateAccessToken);

  io.on("connection", (socket) => {
    socket.on(
      "user-entered",
      async (data) => await handleOnUserEnterStudyroomMessage(socket, data)
    );
    socket.on(
      "user-join",
      async (data) => await handleOnJoinChatroom(socket, data)
    );
    socket.on("user-leave", async (data) => await handleOnLeave(socket, data));
    socket.on("message", async (data) => await handleOnMessage(socket, data));
    // socket.on("reconnect");
    // socket.on("disconnect");
  });
};

module.exports = socketRouter;
