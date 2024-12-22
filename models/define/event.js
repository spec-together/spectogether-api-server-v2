const { DataTypes, Model, Sequelize } = require("sequelize");
class Event extends Model {
  static init(sequelize) {
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
        tableName: "event",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.EventImage, {
      as: "event_images",
      foreignKey: "event_id",
    });
    this.belongsTo(models.User, {
      as: "host",
      foreignKey: "host_id",
    });
  }
}

module.exports = Event;
