const Sequelize = require("sequelize");

class UserRefreshToken extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_refresh_token_id: {
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
        refresh_token: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user_refresh_token",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.UserRefreshToken.belongsTo(models.User, {foreignKey: "user_id",sourceKey: "user_id"});
  }
}

module.exports = UserRefreshToken;
