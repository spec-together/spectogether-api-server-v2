const Sequelize = require("sequelize");

class UserLocal extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        password: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user_local",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    models.UserLocal.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
  }
}

module.exports = UserLocal;
