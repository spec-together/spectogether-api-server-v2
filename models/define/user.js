const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        password: {
          // 추가된 비밀번호 필드
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        birthdate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true, // 전화번호의 고유성 추가
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true, // 이메일의 고유성 추가
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        spec_level: {
          // 기본값 추가
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        manner_score: {
          // 필드명 변경 및 기본값, unsigned 설정
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 5000,
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
        tableName: "user",
        timestamps: false, // created_at 및 updated_at을 수동으로 관리
      }
    );
  }

  static associate(models) {
    User.hasMany(models.UserTerm, { foreignKey: "user_id" });
    User.hasMany(models.UserSpec, { foreignKey: "user_id" });
    User.hasMany(models.UserArea, { foreignKey: "user_id" });
    User.hasMany(models.UserOauth, { foreignKey: "user_id" });
    User.hasMany(models.UserVerifiedEmail, { foreignKey: "user_id" });
    User.hasMany(models.UserRefreshToken, { foreignKey: "user_id" });
    User.hasMany(models.UserStudyroom, { foreignKey: "user_id" });
    User.hasMany(models.StudyroomMember, { foreignKey: "user_id" });
    User.hasMany(models.ScheduleParticipant, { foreignKey: "participant_id" });
    User.hasMany(models.UserCalendar, { foreignKey: "user_id" });
    User.hasMany(models.Todo, { foreignKey: "creater_id" });
    User.hasMany(models.TodoMember, { foreignKey: "assigned_user_id" });
    User.hasMany(models.ContestQuestion, { foreignKey: "user_id" });
    User.hasMany(models.ContestAnswer, { foreignKey: "answer_id" });
    User.hasMany(models.Board, { foreignKey: "author" });
    User.hasMany(models.Inquiry, { foreignKey: "user_id" });
    User.hasMany(models.InquiryAnswer, { foreignKey: "admin_id" });
    User.hasMany(models.StudyroomVideocallMember, { foreignKey: "member_id" });
    User.hasMany(models.StudyroomChat, { foreignKey: "sender_id" });
  }
}

module.exports = User;
