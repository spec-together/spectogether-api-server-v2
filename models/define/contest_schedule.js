const { Model, DataTypes } = require("sequelize");

class ContestSchedule extends Model {
  static init(sequelize) {
    return super.init(
      {
        contest_schedule_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        contest_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        schedule_id: {
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
        tableName: "contest_schedule",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ContestSchedule.belongsTo(models.Contest, { foreignKey: "contest_id" });
    ContestSchedule.belongsTo(models.Schedule, { foreignKey: "schedule_id" });
  }
}

module.exports = ContestSchedule;
