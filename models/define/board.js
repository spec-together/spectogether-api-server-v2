const { Model, DataTypes } = require("sequelize");

class Board extends Model {
  static init(sequelize) {
    return super.init(
      {
        board_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        author: {
          type: DataTypes.BIGINT,
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
        tableName: "board",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Board.belongsTo(models.User, { foreignKey: "author" });
    Board.hasMany(models.ContestBoard, { foreignKey: "board_id" });
  }
}

module.exports = Board;
