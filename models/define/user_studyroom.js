const { Model, DataTypes } = require("sequelize");

class UserStudyroom extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_studyroom_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        user_id: {
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
        tableName: "user_studyroom",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserStudyroom.belongsTo(models.User, { foreignKey: "user_id" });
    UserStudyroom.belongsTo(models.Studyroom, { foreignKey: "studyroom_id" });
  }
}

module.exports = UserStudyroom;
