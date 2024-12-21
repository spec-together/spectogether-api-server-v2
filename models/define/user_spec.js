const Sequelize = require("sequelize");

class UserSpec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
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
      },
      {
        sequelize,
        tableName: "user_spec",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.UserSpec.belongsTo(models.User, {foreignKey: "user_id",sourceKey: "user_id"});
    // models.UserSpec.belongsTo(models.Spec, {foreignKey: "spec_id",sourceKey: "spec_id"});
  }
}

module.exports = UserSpec;
