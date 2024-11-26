const { Model, DataTypes } = require("sequelize");

class UserRefreshToken extends Model {
  static init(sequelize) {
    super.init(
      {
        user_refreshtoken_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        refresh_token: {
          type: DataTypes.TEXT,
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
        tableName: "user_refreshtoken",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserRefreshToken.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

module.exports = UserRefreshToken;
