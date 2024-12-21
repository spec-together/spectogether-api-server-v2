const Sequelize = require("sequelize");

class UserOauth extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_oauth_id: {
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
        oauth_type: {
          type: DataTypes.ENUM("kakao", "github", "naver", "google"),
          allowNull: false,
        },
        oauth_id: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user_oauth",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.UserOauth.belongsTo(models.User, {foreignKey: "user_id",sourceKey: "user_id"});
  }
}

module.exports = UserOauth;
