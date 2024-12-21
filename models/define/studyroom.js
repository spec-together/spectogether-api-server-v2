const Sequelize = require("sequelize");

class Studyroom extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        studyroom_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
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
          references: {
            model: "area",
            key: "area_id",
          },
        },
        profile_image: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        goal: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        goal_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "studyroom",
        hasTrigger: true,
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Studyroom.belongsTo(models.Area, { foreignKey: 'area_id', sourceKey: 'area_id' });
    // models.Studyroom.hasMany(models.StudyroomUser, { foreignKey: 'studyroom_id', sourceKey: 'studyroom_id' });
    // models.Studyroom.hasMany(models.StudyroomSchedule, { foreignKey: 'studyroom_id', sourceKey: 'studyroom_id' });
  }
}

module.exports = Studyroom;
