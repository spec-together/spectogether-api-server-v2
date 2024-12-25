const {
  getChatByCursor,
} = require("../../services/socket/studyroom.chat.socket.service");

getChatByCursor({ studyroom_id: 1, cursor: 8, userId: 1 }).then((data) => {
  console.log(data);
  return;
});
