const { DataTypes, Model, Sequelize } = require("sequelize");

class Area extends Model {
  static init(sequelize) {
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
        tableName: "area",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Studyroom, {
      as: "studyrooms",
      foreignKey: "area_id",
    });
    this.hasMany(models.UserArea, {
      as: "user_areas",
      foreignKey: "area_id",
    });
  }
}

module.exports = Area;
