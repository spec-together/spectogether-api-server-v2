const { Model, DataTypes } = require("sequelize");

class InquiryAnswer extends Model {
  static init(sequelize) {
    super.init(
      {
        inquiry_answer_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        inquiry_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        admin_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        image_url: {
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
        tableName: "inquiry_answer",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    InquiryAnswer.belongsTo(models.Inquiry, { foreignKey: "inquiry_id" });
    InquiryAnswer.belongsTo(models.User, { foreignKey: "admin_id" });
  }
}

module.exports = InquiryAnswer;
