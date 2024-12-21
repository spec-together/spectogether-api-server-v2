const Sequelize = require("sequelize");

class Notice extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        notice_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        author_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        title: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "notice",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Notice.belongsTo(models.User, { foreignKey: "author_id", sourceKey: "user_id" });
  }
}

module.exports = Notice;
