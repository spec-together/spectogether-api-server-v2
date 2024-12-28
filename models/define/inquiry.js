const { DataTypes, Model, Sequelize } = require("sequelize");
class Inquiry extends Model {
  static init(sequelize) {
    return super.init(
      {
        inquiry_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(3000),
          allowNull: false,
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("open", "processing", "closed"),
          allowNull: false,
        },
        checked_at: {
          type: DataTypes.DATE(6),
          allowNull: true,
        },
        closed_at: {
          type: DataTypes.DATE(6),
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
        tableName: "inquiry",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
    this.hasOne(models.InquiryAnswer, {
      as: "inquiry_answer",
      foreignKey: "inquiry_id",
      sourceKey: "inquiry_id",
    });
  }
}

module.exports = Inquiry;
