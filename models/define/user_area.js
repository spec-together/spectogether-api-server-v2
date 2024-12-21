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
