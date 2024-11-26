const { Model, DataTypes } = require("sequelize");

class StudyroomVideocallMember extends Model {
  static init(sequelize) {
    super.init(
      {
        studyroom_videocall_member_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        studyroom_videocall_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        member_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        type: {
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
        tableName: "studyroom_videocall_member",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    StudyroomVideocallMember.belongsTo(models.StudyroomVideocall, {
      foreignKey: "studyroom_videocall_id",
    });
    StudyroomVideocallMember.belongsTo(models.User, {
      foreignKey: "member_id",
    });
  }
}

module.exports = StudyroomVideocallMember;
