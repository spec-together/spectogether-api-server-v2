const Sequelize = require("sequelize");

class UserArea extends Sequelize.Model {
  static init(sequelize, DataTypes) {
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
      },
      {
        sequelize,
        tableName: "user_area",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // models.UserArea.belongsTo(models.User, { foreignKey: 'user_id', sourceKey: 'user_id' });
    // models.UserArea.belongsTo(models.Area, { foreignKey: 'area_id', sourceKey: 'area_id' });
  }
}

module.exports = UserArea;
