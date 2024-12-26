const { DataTypes, Model, Sequelize } = require("sequelize");
class UserArea extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_area_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        area_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "area",
            key: "area_id",
          },
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          // defaultValue: "CURRENT_TIMESTAMP(6)",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "user_area",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Area, {
      as: "area",
      foreignKey: "area_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = UserArea;
