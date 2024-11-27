const { Model, DataTypes } = require("sequelize");

class ContestQuestion extends Model {
  static init(sequelize) {
    return super.init(
      {
        contest_question_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        contest_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        user_id: {
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
        tableName: "contest_question",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    ContestQuestion.belongsTo(models.Contest, { foreignKey: "contest_id" });
    ContestQuestion.belongsTo(models.User, { foreignKey: "user_id" });
    ContestQuestion.hasMany(models.ContestAnswer, {
      foreignKey: "contest_question_id",
    });
  }
}

module.exports = ContestQuestion;
