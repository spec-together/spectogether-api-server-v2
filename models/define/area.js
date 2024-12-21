const Sequelize = require("sequelize");

class Area extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        area_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        sido: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        gungu: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "area",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Area.hasMany(models.Comment, {foreignKey: "area_id",sourceKey: "area_id"});
  }
}

module.exports = Area;
