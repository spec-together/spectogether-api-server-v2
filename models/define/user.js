const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
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
          unique: "user_pk",
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
          defaultValue: 1,
        },
        manner_score: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 5000,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
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
    this.hasMany(models.Admin, {
      as: "admins",
      foreignKey: "user_id",
    });
    this.hasMany(models.Event, {
      as: "events",
      foreignKey: "host_id",
    });
    this.hasMany(models.Inquiry, {
      as: "inquiries",
      foreignKey: "user_id",
    });
    this.hasMany(models.InquiryAnswer, {
      as: "inquiry_answers",
      foreignKey: "admin_id",
    });
    this.hasMany(models.Notice, {
      as: "notices",
      foreignKey: "author_id",
    });
    this.hasMany(models.OrganizationUser, {
      as: "organization_users",
      foreignKey: "user_id",
    });
    this.hasMany(models.Spec, {
      as: "specs",
      foreignKey: "user_id",
    });
    this.hasMany(models.StudyroomChat, {
      as: "studyroom_chats",
      foreignKey: "sender_id",
    });
    this.hasMany(models.StudyroomMember, {
      as: "studyroom_members",
      foreignKey: "user_id",
    });
    this.hasMany(models.Todo, {
      as: "todos",
      foreignKey: "creater_id",
    });
    this.hasMany(models.TodoParticipant, {
      as: "todo_participants",
      foreignKey: "assigned_user_id",
    });
    this.hasMany(models.UserArea, {
      as: "user_areas",
      foreignKey: "user_id",
    });
    this.hasOne(models.UserLocal, {
      as: "user_local",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserOauth, {
      as: "user_oauths",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserRefreshToken, {
      as: "user_refresh_tokens",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserSpec, {
      as: "user_specs",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserStudyroom, {
      as: "user_studyrooms",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserTerm, {
      as: "user_terms",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserTodo, {
      as: "user_todos",
      foreignKey: "user_id",
    });
  }
}

module.exports = User;
