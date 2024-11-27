const { Model, DataTypes } = require("sequelize");

class ScheduleParticipant extends Model {
  static init(sequelize) {
    return super.init(
      {
        schedule_participant_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        schedule_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        participant_id: {
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
        tableName: "schedule_participant",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ScheduleParticipant.belongsTo(models.Schedule, {
      foreignKey: "schedule_id",
    });
    ScheduleParticipant.belongsTo(models.User, {
      foreignKey: "participant_id",
    });
  }
}

module.exports = ScheduleParticipant;
