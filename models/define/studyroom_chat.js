const Sequelize = require("sequelize");

class StudyroomChat extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        studyroom_chat_id: {
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
        sender_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        content: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "studyroom_chat",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.StudyroomChat.belongsTo(models.User, { foreignKey: 'sender_id', sourceKey: 'user_id' });
    // models.StudyroomChat.belongsTo(models.Studyroom, { foreignKey: 'studyroom_id', sourceKey: 'studyroom_id' });
  }
}

module.exports = StudyroomChat;
