const Sequelize = require("sequelize");

class Organization extends Sequelize.Model {
  static init(sequelize, DataTypes) {
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
      },
      {
        sequelize,
        tableName: "organization",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Organization.hasMany(models.OrganizationUser, {foreignKey: "organization_id",sourceKey: "organization_id"});
  }
}

module.exports = Organization;
