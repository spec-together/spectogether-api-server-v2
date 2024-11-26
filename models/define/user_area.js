const { Model, DataTypes } = require("sequelize");

class UserArea extends Model {
  static init(sequelize) {
    super.init(
      {
        user_area_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        area_id: {
          type: DataTypes.BIGINT,
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
        tableName: "user_area",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserArea.belongsTo(models.User, { foreignKey: "user_id" });
    UserArea.belongsTo(models.Area, { foreignKey: "area_id" });
  }
}

module.exports = UserArea;
