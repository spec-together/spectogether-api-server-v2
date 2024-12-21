const Sequelize = require("sequelize");

class StudyroomTodo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        studyroom_todo_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "studyroom",
            key: "studyroom_id",
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
        tableName: "studyroom_todo",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.StudyroomTodo.belongsTo(models.Studyroom, { foreignKey: "studyroom_id", sourceKey: "studyroom_id" });
    // models.StudyroomTodo.belongsTo(models.Todo, { foreignKey: "todo_id", sourceKey: "todo_id" });
  }
}

module.exports = StudyroomTodo;
