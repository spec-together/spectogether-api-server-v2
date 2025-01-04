// FILE: video.socket.router.js
const logger = require("../../logger");

const socketRouter = (io) => {
  logger.debug(`[videoSocketRouter] Loaded`);

  io.on("connection", (socket) => {
    logger.debug(`User connected: ${socket.id}`);

    socket.on("join-room", (roomName) => {
      socket.join(roomName);

      // 현재 방에 있는 다른 사용자들의 소켓 ID를 수집
      const rooms = io.adapter.rooms;
      const usersInRoom = Array.from(rooms.get(roomName) || []);
      const otherUsers = usersInRoom.filter((id) => id !== socket.id);

      logger.debug(`[videoSocketRouter] otherUsers: ${otherUsers}`);

      // 입장한 사용자에게 현재 방의 다른 사용자 목록을 전송
      socket.emit("all-users", otherUsers);

      // 다른 사용자들에게 새로운 사용자가 입장했음을 알림
      socket.to(roomName).emit("user-joined", socket.id);

      logger.debug(
        `[videoSocketRouter] User ${socket.id} joined room: ${roomName}`
      );
    });

    socket.on("offer", (toId, offer) => {
      // 특정 사용자에게 offer를 전달
      socket.to(toId).emit("offer", socket.id, offer);
      logger.debug(`[videoSocketRouter] Offer from ${socket.id} to ${toId}`);
    });

    socket.on("answer", (toId, answer) => {
      // offer를 보낸 사용자에게 answer를 전달
      socket.to(toId).emit("answer", socket.id, answer);
      logger.debug(`[videoSocketRouter] Answer from ${socket.id} to ${toId}`);
    });

    socket.on("ice-candidate", (toId, candidate) => {
      // 특정 사용자에게 ICE 후보 전달
      socket.to(toId).emit("ice-candidate", socket.id, candidate);
      logger.debug(
        `[videoSocketRouter] ICE Candidate from ${socket.id} to ${toId}`
      );
    });

    socket.on("disconnecting", () => {
      // 사용자가 방을 떠날 때 다른 사용자들에게 알림
      // 해당 소켓이 속해 있는 방을 return
      const rooms = socket.rooms;
      // 기본적으로 socket.id라는 방에 속해 있으므로
      // 제외하고 나머지 방에 전달
      rooms.forEach((roomName) => {
        if (roomName !== socket.id) {
          socket.to(roomName).emit("user-left", socket.id);
          logger.debug(
            `[videoSocketRouter] User ${socket.id} left room: ${roomName}`
          );
        }
      });
    });
  });
};

module.exports = socketRouter;
