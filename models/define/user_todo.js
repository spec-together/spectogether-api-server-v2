const Sequelize = require("sequelize");

class UserTodo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_todo_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        todo_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "todo",
            key: "todo_id",
          },
        },
      },
      {
        sequelize,
        tableName: "user_todo",
        timestamps: true,
      }
    );
  }
}

module.exports = UserTodo;
