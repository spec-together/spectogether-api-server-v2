const { Model, DataTypes } = require("sequelize");

class ContestBoard extends Model {
  static init(sequelize) {
    return super.init(
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
          allowNull: false, // TODO : true ? contest 생성 시에는 없을 수 있겠다 싶은데. 일단 초기값 넣어 주는 형태로 구현
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
