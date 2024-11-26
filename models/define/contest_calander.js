const { Model, DataTypes } = require("sequelize");

class ContestCalendar extends Model {
  static init(sequelize) {
    super.init(
      {
        contest_calendar_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        contest_id: {
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
        tableName: "contest_calendar",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ContestCalendar.belongsTo(models.Contest, { foreignKey: "contest_id" });
    ContestCalendar.belongsTo(models.Calendar, { foreignKey: "calendar_id" });
  }
}

module.exports = ContestCalendar;
