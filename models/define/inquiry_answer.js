const { Model, DataTypes } = require("sequelize");

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
        },
        admin_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0, // 관리자 id 값 hardcoding
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
          allowNull: true,
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
    InquiryAnswer.belongsTo(models.Inquiry, {
      foreignKey: "inquiry_id",
      // as: "inquiry",
    });
    // InquiryAnswer.belongsTo(models.User, { foreignKey: "admin_id", as : "admin"}); // 관리자 table, model 미구현 상태
  }
}

module.exports = InquiryAnswer;
