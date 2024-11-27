const { Model, DataTypes } = require("sequelize");

class Area extends Model {
  static init(sequelize) {
    return super.init(
      {
        area_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        location: {
          type: DataTypes.GEOMETRY("POINT"),
          allowNull: false,
        },
        legal_areacode: {
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
        tableName: "area",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Area.hasMany(models.UserArea, { foreignKey: "area_id" });
    Area.hasMany(models.Studyroom, { foreignKey: "area_id" });
  }
}

module.exports = Area;
