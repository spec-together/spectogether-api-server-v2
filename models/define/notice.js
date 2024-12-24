const { DataTypes, Model, Sequelize } = require("sequelize");

class Notice extends Model {
  static init(sequelize) {
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
        tableName: "notice",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.NoticeImage, {
      as: "notice_images",
      foreignKey: "notice_id",
    });
    this.belongsTo(models.User, {
      as: "author",
      foreignKey: "author_id",
    });
  }
}

module.exports = Notice;
