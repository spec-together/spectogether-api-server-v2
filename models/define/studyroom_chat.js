const { Model, DataTypes } = require("sequelize");

class StudyroomChat extends Model {
  static init(sequelize) {
    super.init(
      {
        studyroom_chat_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        sender_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
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
        tableName: "studyroom_chat",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    StudyroomChat.belongsTo(models.User, { foreignKey: "sender_id" });
    StudyroomChat.belongsTo(models.Studyroom, { foreignKey: "studyroom_id" });
  }
}

module.exports = StudyroomChat;
