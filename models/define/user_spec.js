const { DataTypes, Model, Sequelize } = require("sequelize");
class UserSpec extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_spec_id: {
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
        spec_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "spec",
            key: "spec_id",
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
        tableName: "user_spec",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Spec, {
      as: "spec",
      foreignKey: "spec_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = UserSpec;
