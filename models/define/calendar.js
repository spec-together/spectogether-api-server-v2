const { Model, DataTypes } = require("sequelize");

class Calendar extends Model {
  static init(sequelize) {
    return super.init(
      {
        calendar_id: {
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
        tableName: "calendar",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Calendar.hasMany(models.Schedule, { foreignKey: "calendar_id" });
    Calendar.belongsToMany(models.User, {
      through: models.UserCalendar,
      foreignKey: "calendar_id",
      otherKey: "user_id",
    });
    Calendar.belongsToMany(models.Studyroom, {
      through: models.StudyroomCalendar,
      foreignKey: "calendar_id",
      otherKey: "studyroom_id",
    });
    Calendar.belongsToMany(models.Contest, {
      through: models.ContestCalendar,
      foreignKey: "calendar_id",
      otherKey: "contest_id",
    });
  }
}

module.exports = Calendar;
