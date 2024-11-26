const { Model, DataTypes } = require("sequelize");

class EmailVerificationCode extends Model {
  static init(sequelize) {
    super.init(
      {
        email_verification_code_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        code: {
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
        tableName: "email_verification_code",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // 관계 설정이 필요한 경우 추가
  }
}

module.exports = EmailVerificationCode;
