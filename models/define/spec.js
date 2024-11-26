const { Model, DataTypes } = require("sequelize");

class Spec extends Model {
  static init(sequelize) {
    super.init(
      {
        spec_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
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
        tableName: "spec",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Spec.hasMany(models.UserSpec, { foreignKey: "spec_id" });
  }
}

module.exports = Spec;
