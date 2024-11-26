const { Model, DataTypes } = require("sequelize");

class UserCalendar extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        calendar_id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
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
        tableName: "user_calendar",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserCalendar.belongsTo(models.User, { foreignKey: "user_id" });
    UserCalendar.belongsTo(models.Calendar, { foreignKey: "calendar_id" });
  }
}

module.exports = UserCalendar;
