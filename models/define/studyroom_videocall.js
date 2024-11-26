const { Model, DataTypes } = require("sequelize");

class StudyroomVideocall extends Model {
  static init(sequelize) {
    super.init(
      {
        studyroom_videocall_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
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
        tableName: "studyroom_videocall",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    StudyroomVideocall.hasMany(models.StudyroomVideocallMember, {
      foreignKey: "studyroom_videocall_id",
    });
  }
}

module.exports = StudyroomVideocall;
