// Written by Kyeoung Woon Park https://github.com/kyeoungwoon

// npm 패키지 import
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
// const https = require("https"); // https를 사용해야 하는 경우 사용하면 됩니다.
const http = require("http");
const path = require("node:path");

// 로컬 파일들 import, 기능별로 구분해주세요.
const logger = require("./logger");
const {
  corsOptions,
  //  sslOptions
} = require("./options");

const { PORT } = require("./config.json").SERVER;
const {
  errorHandler,
  responseHandler,
} = require("./utils/handlers/response.handlers");

const { swaggerUi, specs } = require("./swagger/swagger");

// Routers는 이 주석 아래에 import 해주시면 됩니다.
// ex) const exampleRouter = require("./routers/example.router");
const authRouter = require("./routes/auth.router");
const usersRouter = require("./routes/users.router");
const noticeRouter = require("./routes/notice.router");
const inquiryRouter = require("./routes/inquiry.router");
const eventRouter = require("./routes/event.router");
const phoneVerificationRouter = require("./routes/phone.verification.router");
const emailVerificationRouter = require("./routes/email.verification.router");
const studyroomRouter = require("./routes/studyroom.router");
const advertisementRouter = require("./routes/advertisement.router");
const testRouter = require("./routes/test.router");

// TODO : 일단 구현 중에는 분리해서 구현하고 있으며, 구현 끝나고 스터디 룸 등으로 이동할지 결정하자.
const todoRouter = require("./routes/todo.router");

// Socket.io Router는 이 주석 아래에 import 해주시면 됩니다.
// ex) const exampleSocketRouter = require("./routes/example.socket.router");
const studyroomChatSocketRouter = require("./routes/socket/studyroom.chat.socket.router");
const videoSocketRouter = require("./routes/socket/video.socket.router");
// ** 중요 ** 미들웨어 순서를 변경할 때는 신경써서 작업해 주세요.
const app = express();

app.use(responseHandler);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/static", express.static("public")); // 정적 파일 제공. public 폴더 안에 있는 파일들을 /static 경로를 통해 접근 가능
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger 설정
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 이 주석 하단에 Router들을 use 해주시면 됩니다.
// ex) app.use("/example", exampleRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/notices", noticeRouter);
app.use("/inquiries", inquiryRouter);
app.use("/events", eventRouter);
app.use("/verification/email", emailVerificationRouter);
app.use("/verification/phone", phoneVerificationRouter);
app.use("/todos", todoRouter);
app.use("/studyrooms", studyroomRouter);
app.use("/ads", advertisementRouter);
app.use("/test", testRouter);

// 에러 핸들러는 최하단에 위치해야 하는 미들웨어입니다. 절대 순서를 변경하지 마세요.
app.use(errorHandler);

// http, https 사용하실 프로토콜에 맞추어 주석 해제하고 사용하시면 됩니다.
// const server = https.createServer(sslOptions, app);
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server is running on PORT ${PORT}`);
});

const io = new Server(server, {
  cors: corsOptions,
  // CORS option은 HTTP 서버와 공유합니다.
  // 따로 설정하시려면 다시 작성하시면 됩니다.
  cookie: true,
});

// 하단에 Socket.io Router를 추가하면 됩니다.
// ex) exapmpleSocketRouter(io);
const socketNamespaceChat = io.of("/chat");
studyroomChatSocketRouter(socketNamespaceChat);

const socketNamespaceVideo = io.of("/video");
videoSocketRouter(socketNamespaceVideo);
