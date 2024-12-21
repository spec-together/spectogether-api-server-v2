const Sequelize = require("sequelize");

class Spec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        spec_id: {
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
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        host: {
          type: DataTypes.STRING(256),
          allowNull: false,
          defaultValue: "",
        },
        spec_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(10000),
          allowNull: false,
          defaultValue: "",
        },
      },
      {
        sequelize,
        tableName: "spec",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Spec.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'user_id' });
  }
}

module.exports = Spec;
