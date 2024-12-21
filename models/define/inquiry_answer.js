const Sequelize = require("sequelize");

class InquiryAnswer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        inquiry_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
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
      },
      {
        sequelize,
        tableName: "inquiry_answer",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.InquiryAnswer.belongsTo(models.Inquiry, {foreignKey: "inquiry_id",targetKey: "inquiry_id"});
    // models.InquiryAnswer.belongsTo(models.User, {foreignKey: "admin_id",targetKey: "user_id"});
  }
}

module.exports = InquiryAnswer;
