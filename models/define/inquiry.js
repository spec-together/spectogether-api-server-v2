const Sequelize = require("sequelize");

class Inquiry extends Sequelize.Model {
  static init(sequelize, DataTypes) {
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
      },
      {
        sequelize,
        tableName: "inquiry",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Inquiry.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
  }
}

module.exports = Inquiry;
