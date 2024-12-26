const { DataTypes, Model, Sequelize } = require("sequelize");
class Todo extends Model {
  static init(sequelize) {
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
        status: {
          type: DataTypes.ENUM("pending", "done", "deleted"),
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
        tableName: "todo",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.StudyroomTodo, {
      as: "studyroom_todos",
      foreignKey: "todo_id",
    });
    this.hasMany(models.TodoParticipant, {
      as: "todo_participants",
      foreignKey: "todo_id",
    });
    this.hasMany(models.UserTodo, {
      as: "user_todos",
      foreignKey: "todo_id",
    });
    this.belongsTo(models.User, {
      as: "creater",
      foreignKey: "creater_id",
    });
  }
}

module.exports = Todo;
