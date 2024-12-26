const { DataTypes, Model, Sequelize } = require("sequelize");
class UserStudyroom extends Model {
  static init(sequelize) {
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
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
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
    this.belongsTo(models.Studyroom, {
      as: "studyroom",
      foreignKey: "studyroom_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = UserStudyroom;
