const { Model, DataTypes } = require("sequelize");

class Studyroom extends Model {
  static init(sequelize) {
    return super.init(
      {
        studyroom_id: {
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
        area_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        contest_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        spec_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        status: {
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
        tableName: "studyroom",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Studyroom.belongsTo(models.Area, { foreignKey: "area_id" });
    Studyroom.hasMany(models.UserStudyroom, { foreignKey: "studyroom_id" });
    Studyroom.hasMany(models.StudyroomMember, { foreignKey: "studyroom_id" });
    Studyroom.belongsToMany(models.Calendar, {
      through: models.StudyroomCalendar,
      foreignKey: "studyroom_id",
      otherKey: "calendar_id",
    });
    Studyroom.hasMany(models.StudyroomChat, { foreignKey: "studyroom_id" });
    // Studyroom.hasMany(models.StudyroomTodo, { foreignKey: "studyroom_id" });
    Studyroom.belongsToMany(models.Todo, {
      through: models.StudyroomTodo,
      foreignKey: "studyroom_id",
      otherKey: "todo_id",
      // as: "todos",
    });
    Studyroom.belongsTo(models.Contest, {
      foreignKey: "contest_id",
      as: "contest",
    });
    Studyroom.belongsTo(models.Spec, {
      foreignKey: "spec_id",
      as: "spec",
    });
  }
}

module.exports = Studyroom;
