const Sequelize = require("sequelize");

class Admin extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        admin_id: {
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
        permission: {
          type: DataTypes.ENUM("full", "notice", "studyroom", "inquiry"),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "admin",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Admin.belongsTo(models.User, { foreignKey: "user_id", targetKey: "user_id" });
  }
}

module.exports = Admin;
