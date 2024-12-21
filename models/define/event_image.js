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
      },
      {
        sequelize,
        tableName: "event_image",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.EventImage.belongsTo(models.Event, {foreignKey: "event_id",targetKey: "event_id"});
  }
}

module.exports = EventImage;
