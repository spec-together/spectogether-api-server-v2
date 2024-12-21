const Sequelize = require("sequelize");

class VerficationCode extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        verification_code_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        verification_code: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        attempt: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        identifier_type: {
          type: DataTypes.ENUM("email", "phone"),
          allowNull: false,
        },
        identifier_value: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "verfication_code",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.VerficationCode.belongsTo(models.User, {foreignKey: "user_id",sourceKey: "user_id"});
  }
}

module.exports = VerficationCode;
