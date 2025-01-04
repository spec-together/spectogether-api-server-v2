"use strict";

// const fs = require("node:fs");
// const path = require("node:path");
const Sequelize = require("sequelize");

const logger = require("../logger");
const dBconfig = require("../config.json").DATABASE;

const sequelize = new Sequelize(
  dBconfig.MYSQL_DATABASE,
  dBconfig.MYSQL_USER,
  dBconfig.MYSQL_PASSWORD,
  {
    host: dBconfig.MYSQL_HOST,
    port: dBconfig.MYSQL_PORT,
    dialect: "mysql",
    logging: (msg) => logger.info(`[Sequelize Log]: ${msg} ✨`),
    timezone: "+09:00",
    pool: {
      max: 10, // 최대 연결 수
      min: 0, // 최소 연결 수
      acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
      idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
    },
  }
);

const db = {};
db.Admin = require("./define/admin");
db.Area = require("./define/area");
db.CarouselAd = require("./define/carousel_ad");
db.Event = require("./define/event");
db.EventImage = require("./define/event_image");
db.Inquiry = require("./define/inquiry");
db.InquiryAnswer = require("./define/inquiry_answer");
db.Notice = require("./define/notice");
db.NoticeImage = require("./define/notice_image");
db.Organization = require("./define/organization");
db.OrganizationUser = require("./define/organization_user");
db.School = require("./define/school");
db.Spec = require("./define/spec");
db.SpecPhoto = require("./define/spec_photo");
db.Studyroom = require("./define/studyroom");
db.StudyroomChat = require("./define/studyroom_chat");
db.StudyroomInvite = require("./define/studyroom_invite");
db.StudyroomMember = require("./define/studyroom_member");
db.StudyroomTodo = require("./define/studyroom_todo");
db.Term = require("./define/term");
db.Todo = require("./define/todo");
db.TodoParticipant = require("./define/todo_participant");
db.User = require("./define/user");
db.UserArea = require("./define/user_area");
db.UserLocal = require("./define/user_local");
db.UserOauth = require("./define/user_oauth");
db.UserPayments = require("./define/user_payments");
db.UserPremium = require("./define/user_premium");
db.UserRefreshToken = require("./define/user_refresh_token");
db.UserSchool = require("./define/user_school");
db.UserSpec = require("./define/user_spec");
db.UserStudyroom = require("./define/user_studyroom");
db.UserTerm = require("./define/user_term");
db.UserTodo = require("./define/user_todo");
db.VerificationCode = require("./define/verification_code");
// console.log("모델 갯수 :", Object.keys(db).length);

// const modelsDir = path.join(__dirname, "define");
// const modelFiles = fs.readdirSync(modelsDir);
// modelFiles.filter((file) => { return (file.slice(-3) === ".js" && !file.startsWith(".") && !file.endsWith(".test.js")); })
//   .forEach((file) => { const model = require(path.join(modelsDir, file)); model.init(sequelize); db[model.name] = model; });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
