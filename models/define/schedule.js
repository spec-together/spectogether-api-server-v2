const { Model, DataTypes } = require("sequelize");

class Schedule extends Model {
  static init(sequelize) {
    return super.init(
      {
        schedule_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        calendar_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        starts_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        ends_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        memo: {
          type: DataTypes.TEXT,
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
        tableName: "schedule",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Schedule.belongsTo(models.Calendar, { foreignKey: "calendar_id" });
    Schedule.hasMany(models.ScheduleParticipant, { foreignKey: "schedule_id" });
  }
}

module.exports = Schedule;
