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
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
      },
      {
        sequelize,
        tableName: "studyroom",
        hasTrigger: true,
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Area, {
      as: "area",
      foreignKey: "area_id",
    });
    this.hasMany(models.StudyroomChat, {
      as: "studyroom_chats",
      foreignKey: "studyroom_id",
    });
    this.hasMany(models.StudyroomMember, {
      as: "studyroom_members",
      foreignKey: "studyroom_id",
    });
    this.hasMany(models.StudyroomTodo, {
      as: "studyroom_todos",
      foreignKey: "studyroom_id",
    });
    this.hasMany(models.UserStudyroom, {
      as: "user_studyrooms",
      foreignKey: "studyroom_id",
    });
  }
}

module.exports = Studyroom;
