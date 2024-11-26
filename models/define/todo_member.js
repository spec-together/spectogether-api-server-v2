const { Model, DataTypes } = require("sequelize");

class TodoMember extends Model {
  static init(sequelize) {
    super.init(
      {
        todo_member_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        todo_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        assigned_user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        photo: {
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
        tableName: "todo_member",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    TodoMember.belongsTo(models.Todo, { foreignKey: "todo_id" });
    TodoMember.belongsTo(models.User, { foreignKey: "assigned_user_id" });
  }
}

module.exports = TodoMember;
