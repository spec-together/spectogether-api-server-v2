const { Model, DataTypes } = require("sequelize");

class StudyroomTodo extends Model {
  static init(sequelize) {
    return super.init(
      {
        studyroom_todo_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        todo_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
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
    StudyroomTodo.belongsTo(models.Studyroom, { foreignKey: "studyroom_id" });
    StudyroomTodo.belongsTo(models.Todo, { foreignKey: "todo_id" });
  }
}

module.exports = StudyroomTodo;
