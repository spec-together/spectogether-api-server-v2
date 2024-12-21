const Sequelize = require("sequelize");

class UserStudyroom extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_studyroom_id: {
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
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
      },
      {
        sequelize,
        tableName: "user_studyroom",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.UserStudyroom.belongsTo(models.Studyroom, { foreignKey: "studyroom_id", sourceKey: "studyroom_id" });
    // models.UserStudyroom.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
  }
}

module.exports = UserStudyroom;
