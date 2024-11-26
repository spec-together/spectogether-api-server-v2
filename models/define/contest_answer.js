const { Model, DataTypes } = require("sequelize");

class ContestAnswer extends Model {
  static init(sequelize) {
    super.init(
      {
        contest_answer_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        contest_question_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        answer_id: {
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
        tableName: "contest_answer",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ContestAnswer.belongsTo(models.ContestQuestion, {
      foreignKey: "contest_question_id",
    });
    ContestAnswer.belongsTo(models.User, { foreignKey: "answer_id" });
  }
}

module.exports = ContestAnswer;
