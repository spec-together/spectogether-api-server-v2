const { DataTypes, Model, Sequelize } = require("sequelize");

class StudyroomInvite extends Model {
  static init(sequelize) {
    return super.init(
      {
        studyroom_invite_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        studyroom_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: "studyroom",
            key: "studyroom_id",
          },
        },
        inviter_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        invitee_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        status: {
          type: DataTypes.ENUM("pending", "accepted", "declined"),
          allowNull: false,
          defaultValue: "pending",
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
          onUpdate: "SET DEFAULT",
        },
      },
      {
        sequelize,
        tableName: "studyroom_invite",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Studyroom, {
      foreignKey: "studyroom_id",
      as: "studyroom",
    });
    this.belongsTo(models.User, { as: "inviter", foreignKey: "inviter_id" });
    this.belongsTo(models.User, { as: "invitee", foreignKey: "invitee_id" });
  }
}

module.exports = StudyroomInvite;
