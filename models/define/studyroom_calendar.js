const { Model, DataTypes } = require("sequelize");

class StudyroomCalendar extends Model {
  static init(sequelize) {
    super.init(
      {
        studyroom_calendar_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        calendar_id: {
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
        tableName: "studyroom_calendar",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    StudyroomCalendar.belongsTo(models.Studyroom, {
      foreignKey: "studyroom_id",
    });
    StudyroomCalendar.belongsTo(models.Calendar, { foreignKey: "calendar_id" });
  }
}

module.exports = StudyroomCalendar;
