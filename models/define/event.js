const Sequelize = require("sequelize");

class Event extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        event_id: {
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
          defaultValue: "",
        },
        poster_image_url: {
          type: DataTypes.STRING(512),
          allowNull: false,
          defaultValue: "",
        },
        description: {
          type: DataTypes.STRING(10000),
          allowNull: false,
        },
        host_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        application_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
          defaultValue: "",
        },
        location: {
          type: DataTypes.STRING(512),
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
        is_online: {
          type: DataTypes.BOOLEAN,
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
      },
      {
        sequelize,
        tableName: "event",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Event.belongsTo(models.User, {foreignKey: "host_id",targetKey: "user_id"});
    // models.Event.hasMany(models.Application, {foreignKey: "event_id",sourceKey: "event_id"});
  }
}

module.exports = Event;
