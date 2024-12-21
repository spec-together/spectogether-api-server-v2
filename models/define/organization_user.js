const Sequelize = require("sequelize");

class OrganizationUser extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        organization_user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        organization_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "organization",
            key: "organization_id",
          },
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        class: {
          type: DataTypes.STRING(512),
          allowNull: false,
          defaultValue: "",
        },
      },
      {
        sequelize,
        tableName: "organization_user",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.OrganizationUser.belongsTo(models.Organization, {foreignKey: "organization_id",sourceKey: "organization_id"});
    // models.OrganizationUser.belongsTo(models.User, {foreignKey: "user_id",sourceKey: "user_id"});
  }
}

module.exports = OrganizationUser;
