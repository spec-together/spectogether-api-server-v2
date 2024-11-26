const { Model, DataTypes } = require("sequelize");

class UserSpec extends Model {
  static init(sequelize) {
    super.init(
      {
        user_spec_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        spec_id: {
          type: DataTypes.BIGINT,
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
        tableName: "user_spec",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserSpec.belongsTo(models.User, { foreignKey: "user_id" });
    UserSpec.belongsTo(models.Spec, { foreignKey: "spec_id" });
  }
}

module.exports = UserSpec;
