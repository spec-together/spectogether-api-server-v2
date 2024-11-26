const { Model, DataTypes } = require("sequelize");

class ContestBoard extends Model {
  static init(sequelize) {
    super.init(
      {
        contest_board_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        contest_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        board_id: {
          type: DataTypes.BIGINT,
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
        tableName: "contest_board",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ContestBoard.belongsTo(models.Contest, { foreignKey: "contest_id" });
    ContestBoard.belongsTo(models.Board, { foreignKey: "board_id" });
  }
}

module.exports = ContestBoard;
