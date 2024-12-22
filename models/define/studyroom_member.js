const { DataTypes, Model, Sequelize } = require("sequelize");

class StudyroomMember extends Model {
  static init(sequelize) {
    return super.init(
      {
        studyroom_member_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "studyroom",
            key: "studyroom_id",
          },
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        role: {
          type: DataTypes.ENUM("owner", "admin", "member"),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("active", "blocked"),
          allowNull: false,
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
        tableName: "studyroom_member",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Studyroom, {
      as: "studyroom",
      foreignKey: "studyroom_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = StudyroomMember;
