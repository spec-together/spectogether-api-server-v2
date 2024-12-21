"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Sequelize = require("sequelize");

const logger = require("../logger");
// const basename = path.basename(__filename);
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

const modelsDir = path.join(__dirname, "define");
const modelFiles = fs.readdirSync(modelsDir);

const db = {};

modelFiles
  .filter((file) => {
    return (
      file.slice(-3) === ".js" &&
      // file !== basename &&
      !file.startsWith(".") &&
      !file.endsWith(".test.js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file)); // Function
    model.init(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
