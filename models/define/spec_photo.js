const Sequelize = require("sequelize");

class SpecPhoto extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        spec_photo_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        spec_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "spec",
            key: "spec_id",
          },
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
          defaultValue: "",
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: "spec_photo",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Spec, {
      as: "spec",
      foreignKey: "spec_id",
    });
  }
}

module.exports = SpecPhoto;
