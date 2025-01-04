const { DataTypes, Model, Sequelize } = require("sequelize");
class CarouselAd extends Model {
  static init(sequelize) {
    return super.init(
      {
        carousel_ad_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          primaryKey: true,
        },
        link: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "carousel_ad",
        timestamps: false,
      }
    );
  }
  static associate(models) {}
}

module.exports = CarouselAd;
