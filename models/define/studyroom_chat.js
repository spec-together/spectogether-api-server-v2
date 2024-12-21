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
        tableName: "studyroom_chat",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Studyroom, {
      as: "studyroom",
      foreignKey: "studyroom_id",
    });
    this.belongsTo(models.User, {
      as: "sender",
      foreignKey: "sender_id",
    });
  }
}

module.exports = StudyroomChat;
