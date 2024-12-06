const Sequelize = require("sequelize");
const { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } =
  require("../config.json").DATABASE;
const logger = require("../logger");

const User = require("./define/user");
const Term = require("./define/term");
const Area = require("./define/area");
const Spec = require("./define/spec");
const EmailVerificationCode = require("./define/email_verification_code");
const Calendar = require("./define/calendar");
const Contest = require("./define/contest");
const StudyroomVideocall = require("./define/studyroom_videocall");
const UserTerm = require("./define/user_term");
const UserSpec = require("./define/user_spec");
const UserArea = require("./define/user_area");
const UserOauth = require("./define/user_oauth");
const UserVerifiedEmail = require("./define/user_verified_email");
const UserRefreshToken = require("./define/user_refresh_token");
const Studyroom = require("./define/studyroom");
const UserStudyroom = require("./define/user_studyroom");
const StudyroomMember = require("./define/studyroom_member");
const StudyroomCalendar = require("./define/studyroom_calendar");
const Schedule = require("./define/schedule");
const ScheduleParticipant = require("./define/schedule_participant");
const ContestCalendar = require("./define/contest_calendar");
const ContestSchedule = require("./define/contest_schedule");
const UserCalendar = require("./define/user_calendar");
const Todo = require("./define/todo");
const StudyroomTodo = require("./define/studyroom_todo");
const TodoMember = require("./define/todo_member");
const ContestQuestion = require("./define/contest_question");
const ContestAnswer = require("./define/contest_answer");
const Board = require("./define/board");
const ContestBoard = require("./define/contest_board");
const Inquiry = require("./define/inquiry");
const InquiryAnswer = require("./define/inquiry_answer");
const StudyroomVideocallMember = require("./define/studyroom_videocall_member");
const StudyroomChat = require("./define/studyroom_chat");
const KakaoUserInfo = require("./define/kakao_user_info");

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: "mysql",
  logging: (msg) => logger.info(`[Sequelize Log]: ${msg}`),
  timezone: "+09:00",
  pool: {
    max: 10, // 최대 연결 수
    min: 0, // 최소 연결 수
    acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
    idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
  },
});

const models = {
  User: User.init(sequelize),
  Term: Term.init(sequelize),
  Area: Area.init(sequelize),
  Spec: Spec.init(sequelize),
  EmailVerificationCode: EmailVerificationCode.init(sequelize),
  Calendar: Calendar.init(sequelize),
  Contest: Contest.init(sequelize),
  StudyroomVideocall: StudyroomVideocall.init(sequelize),
  UserTerm: UserTerm.init(sequelize),
  UserSpec: UserSpec.init(sequelize),
  UserArea: UserArea.init(sequelize),
  UserOauth: UserOauth.init(sequelize),
  UserVerifiedEmail: UserVerifiedEmail.init(sequelize),
  UserRefreshToken: UserRefreshToken.init(sequelize),
  Studyroom: Studyroom.init(sequelize),
  UserStudyroom: UserStudyroom.init(sequelize),
  StudyroomMember: StudyroomMember.init(sequelize),
  StudyroomCalendar: StudyroomCalendar.init(sequelize),
  Schedule: Schedule.init(sequelize),
  ScheduleParticipant: ScheduleParticipant.init(sequelize),
  ContestCalendar: ContestCalendar.init(sequelize),
  ContestSchedule: ContestSchedule.init(sequelize),
  UserCalendar: UserCalendar.init(sequelize),
  Todo: Todo.init(sequelize),
  StudyroomTodo: StudyroomTodo.init(sequelize),
  TodoMember: TodoMember.init(sequelize),
  ContestQuestion: ContestQuestion.init(sequelize),
  ContestAnswer: ContestAnswer.init(sequelize),
  Board: Board.init(sequelize),
  ContestBoard: ContestBoard.init(sequelize),
  Inquiry: Inquiry.init(sequelize),
  InquiryAnswer: InquiryAnswer.init(sequelize),
  StudyroomVideocallMember: StudyroomVideocallMember.init(sequelize),
  StudyroomChat: StudyroomChat.init(sequelize),
  KakaoUserInfo: KakaoUserInfo.init(sequelize),
  Sequelize,
  sequelize,
};

// 모델 간의 관계 설정
Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

module.exports = models;
