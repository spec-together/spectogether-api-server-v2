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
          type: DataTypes.ENUM("pending", "done", "deleted"),
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
        tableName: "todo_participant",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Todo, {
      as: "todo",
      foreignKey: "todo_id",
    });
    this.belongsTo(models.User, {
      as: "assigned_user",
      foreignKey: "assigned_user_id",
    });
  }
}

module.exports = TodoParticipant;
