// kakao_user_info.js

const { Model, DataTypes } = require("sequelize");

class KakaoUserInfo extends Model {
  static init(sequelize) {
    return super.init(
      {
        kakao_user_info_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        kakao_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(256),
          allowNull: true,
        },
        profile_image_url: {
          type: DataTypes.STRING(2048),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "kakao_user_info",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // 관계 설정 (예시)
    // KakaoUserInfo.belongsTo(models.User, { foreignKey: "user_id" });
    // 필요에 따라 추가하세요.
  }
}

module.exports = KakaoUserInfo;
