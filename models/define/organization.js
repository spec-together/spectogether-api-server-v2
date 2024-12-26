const { DataTypes, Model, Sequelize } = require("sequelize");
class Organization extends Model {
  static init(sequelize) {
    return super.init(
      {
        organization_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          defaultValue: "",
        },
        type: {
          type: DataTypes.ENUM("public", "private", "community"),
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
        tableName: "organization",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.OrganizationUser, {
      as: "organization_users",
      foreignKey: "organization_id",
    });
  }
}

module.exports = Organization;
