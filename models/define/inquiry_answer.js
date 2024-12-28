const { DataTypes, Model, Sequelize } = require("sequelize");
class InquiryAnswer extends Model {
  static init(sequelize) {
    return super.init(
      {
        inquiry_answer_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        inquiry_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "inquiry",
            key: "inquiry_id",
          },
        },
        admin_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        title: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: true,
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
        tableName: "inquiry_answer",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, {
      as: "admin",
      foreignKey: "admin_id",
      targetKey: "user_id",
    });
    this.belongsTo(models.Inquiry, {
      as: "inquiry",
      foreignKey: "inquiry_id",
      targetKey: "inquiry_id",
    });
  }
}

module.exports = InquiryAnswer;
