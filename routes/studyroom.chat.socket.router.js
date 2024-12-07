const {
  handleOnInitialMessage,
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
      "initial-message",
      async (data) => await handleOnInitialMessage(socket, data)
    );
  });
};

module.exports = socketRouter;
