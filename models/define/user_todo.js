const { DataTypes, Model, Sequelize } = require("sequelize");
class UserTodo extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_todo_id: {
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
        todo_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "todo",
            key: "todo_id",
          },
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
        tableName: "user_todo",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
    this.belongsTo(models.Todo, {
      as: "todo",
      foreignKey: "todo_id",
    });
  }
}

module.exports = UserTodo;
