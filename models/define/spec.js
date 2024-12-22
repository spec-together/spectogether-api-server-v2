const { DataTypes, Model, Sequelize } = require("sequelize");
class Spec extends Model {
  static init(sequelize) {
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
        status: {
          type: DataTypes.ENUM("public", "private"),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(10000),
          allowNull: false,
          defaultValue: "",
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: "CURRENT_TIMESTAMP(6)",
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
    this.hasMany(models.SpecPhoto, {
      as: "spec_photos",
      foreignKey: "spec_id",
    });
    this.hasMany(models.UserSpec, {
      as: "user_specs",
      foreignKey: "spec_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = Spec;
