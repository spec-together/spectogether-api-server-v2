const Sequelize = require("sequelize");

class EventImage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        event_image_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        event_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "event",
            key: "event_id",
          },
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
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
        tableName: "event_image",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Event, {
      as: "event",
      foreignKey: "event_id",
    });
  }
}

module.exports = EventImage;
