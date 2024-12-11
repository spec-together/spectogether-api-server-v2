const { Model, DataTypes } = require("sequelize");

class Inquiry extends Model {
  static init(sequelize) {
    return super.init(
      {
        inquiry_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
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
          allowNull: true,
        },
        read_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        answered_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "pending",
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
        tableName: "inquiry",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Inquiry.hasMany(models.InquiryAnswer, {
      foreignKey: "inquiry_id",
      as: "inquiryAnswers",
    });
    Inquiry.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

module.exports = Inquiry;
