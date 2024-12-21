const Sequelize = require("sequelize");

class TodoParticipant extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        todo_participant_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        todo_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "todo",
            key: "todo_id",
          },
        },
        assigned_user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "todo_participant",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.TodoParticipant.belongsTo(models.Todo, { foreignKey: "todo_id", sourceKey: "todo_id" });
    // models.TodoParticipant.belongsTo(models.User, { foreignKey: "assigned_user_id", sourceKey: "user_id" });
  }
}

module.exports = TodoParticipant;
