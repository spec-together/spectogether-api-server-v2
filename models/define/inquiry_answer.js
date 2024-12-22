const { DataTypes, Model, Sequelize } = require("sequelize");
class InquiryAnswer extends Model {
  static init(sequelize) {
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
        tableName: "inquiry_answer",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, {
      as: "admin",
      foreignKey: "admin_id",
    });
    this.belongsTo(models.Inquiry, {
      as: "inquiry",
      foreignKey: "inquiry_id",
    });
  }
}

module.exports = InquiryAnswer;
