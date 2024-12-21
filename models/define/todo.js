const Sequelize = require("sequelize");

class Todo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        todo_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
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
        location: {
          type: DataTypes.STRING(512),
          allowNull: true,
        },
        starts_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        ends_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        creater_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
      },
      {
        sequelize,
        tableName: "todo",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Todo.belongsTo(models.User, { foreignKey: 'creater_id', sourceKey: 'user_id' });
  }
}

module.exports = Todo;
