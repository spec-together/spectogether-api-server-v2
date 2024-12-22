const Sequelize = require("sequelize");

class UserPayments extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_payments_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
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
        payment_amount: {
          type: DataTypes.INTEGER,
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
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "user_payments",
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

module.exports = UserPayments;
