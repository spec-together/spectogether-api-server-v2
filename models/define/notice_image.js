const { DataTypes, Model, Sequelize } = require("sequelize");
class NoticeImage extends Model {
  static init(sequelize) {
    return super.init(
      {
        notice_image_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        notice_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "notice",
            key: "notice_id",
          },
        },
        image_url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
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
          onUpdate: "SET DEFAULT",
        },
      },
      {
        sequelize,
        tableName: "notice_image",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Notice, {
      as: "notice",
      foreignKey: "notice_id",
    });
  }
}

module.exports = NoticeImage;
