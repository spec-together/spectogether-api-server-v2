const { Model, DataTypes } = require("sequelize");

class Contest extends Model {
  static init(sequelize) {
    return super.init(
      {
        contest_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        subtitle: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        host: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        location: {
          type: DataTypes.GEOMETRY("POINT"),
          allowNull: false,
        },
        online_offline_type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        application_start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        application_end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATE,
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
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        application_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "contest",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Contest.hasOne(models.ContestBoard, {
      foreignKey: "contest_id", // contest_id는 ContestBoard의 foreign key
      // as: "contestBoard", onDelete: "CASCADE",
    });
    Contest.hasOne(models.ContestCalendar, {
      foreignKey: "contest_id", // contest_id는 ContestCalendar의 foreign key
      // as: "contestCalendar", onDelete: "CASCADE",
    });
    // Contest.belongsTo(models.Calendar, {
    //   through: models.ContestCalendar,
    //   foreignKey: "contest_id",
    //   otherKey: "calendar_id",
    // });
    Contest.hasMany(models.ContestQuestion, { foreignKey: "contest_id" });
    Contest.hasMany(models.ContestSchedule, { foreignKey: "contest_id" });
    Contest.hasMany(models.Studyroom, { foreignKey: "contest_id" });
  }
}

module.exports = Contest;
