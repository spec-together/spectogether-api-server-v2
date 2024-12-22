const { DataTypes, Model, Sequelize } = require("sequelize");
class OrganizationUser extends Model {
  static init(sequelize) {
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
        tableName: "organization_user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "organization_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = OrganizationUser;
