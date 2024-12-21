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
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
      },
      {
        sequelize,
        tableName: "studyroom_todo",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Studyroom, {
      as: "studyroom",
      foreignKey: "studyroom_id",
    });
    this.belongsTo(models.Todo, {
      as: "todo",
      foreignKey: "todo_id",
    });
  }
}

module.exports = StudyroomTodo;
