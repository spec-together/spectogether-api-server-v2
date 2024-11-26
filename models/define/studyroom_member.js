const { Model, DataTypes } = require("sequelize");

class StudyroomMember extends Model {
  static init(sequelize) {
    super.init(
      {
        studyroom_member_id: {
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
        role: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
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
        tableName: "studyroom_member",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    StudyroomMember.belongsTo(models.User, { foreignKey: "user_id" });
    StudyroomMember.belongsTo(models.Studyroom, { foreignKey: "studyroom_id" });
  }
}

module.exports = StudyroomMember;
