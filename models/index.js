const Sequelize = require("sequelize");
const { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } =
  require("../config.json").DATABASE;
const logger = require("../logger");

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

const path = require("node:path");
const fs = require("node:fs");

const modelsDir = path.join(__dirname, "define");
const modelFiles = fs.readdirSync(modelsDir);

const db = {};

for (const file of modelFiles) {
  const model = require(path.join(modelsDir, file)); // Function
  model.init(sequelize);
  db[model.name] = model; // string
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
