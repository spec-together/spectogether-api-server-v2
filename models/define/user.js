const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
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
        birthdate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        spec_level: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        manner_level: {
          type: DataTypes.INTEGER,
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
        tableName: "user",
        timestamps: false,
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
