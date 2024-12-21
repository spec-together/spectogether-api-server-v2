const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        birthdate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: "user_pk",
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        spec_level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        manner_score: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 5000,
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // models.User.hasMany(models.Comment, {foreignKey: "user_id",sourceKey: "user_id"});
  }
}

module.exports = User;
