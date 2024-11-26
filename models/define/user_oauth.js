const { Model, DataTypes } = require("sequelize");

class UserOauth extends Model {
  static init(sequelize) {
    super.init(
      {
        user_oauth_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        oauth_type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        oauth_id: {
          type: DataTypes.STRING(255),
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
        tableName: "user_oauth",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserOauth.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

module.exports = UserOauth;
