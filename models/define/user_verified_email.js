const { Model, DataTypes } = require("sequelize");

class UserVerifiedEmail extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_verified_email_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        verified_email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        verification_type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
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
        tableName: "user_verified_email",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserVerifiedEmail.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

module.exports = UserVerifiedEmail;
