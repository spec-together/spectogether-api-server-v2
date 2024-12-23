const { DataTypes, Model, Sequelize } = require("sequelize");
class VerificationCode extends Model {
  static init(sequelize) {
    return super.init(
      {
        verification_code_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        verification_code: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        attempt: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        identifier_type: {
          type: DataTypes.ENUM("email", "phone"),
          allowNull: false,
        },
        identifier_value: {
          type: DataTypes.STRING(1024),
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
        tableName: "verification_code",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    // this.
  }
}

module.exports = VerificationCode;
