const { DataTypes, Model, Sequelize } = require("sequelize");

class UserLocal extends Model {
  static init(sequelize) {
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
        tableName: "user_local",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = UserLocal;
