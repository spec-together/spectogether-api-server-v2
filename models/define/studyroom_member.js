const Sequelize = require("sequelize");

class StudyroomMember extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        studyroom_member_id: {
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
        role: {
          type: DataTypes.ENUM("owner", "admin", "member"),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("active", "blocked"),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "studyroom_member",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.StudyroomMember.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
    // models.StudyroomMember.belongsTo(models.Studyroom, { foreignKey: "studyroom_id", sourceKey: "studyroom_id" });
  }
}

module.exports = StudyroomMember;
