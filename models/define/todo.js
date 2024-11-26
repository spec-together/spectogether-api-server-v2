const { Model, DataTypes } = require("sequelize");

class Todo extends Model {
  static init(sequelize) {
    super.init(
      {
        todo_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        subtitle: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        creater_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
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
        tableName: "todo",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Todo.belongsTo(models.User, { foreignKey: "creater_id" });
    Todo.hasMany(models.TodoMember, { foreignKey: "todo_id" });
  }
}

module.exports = Todo;
