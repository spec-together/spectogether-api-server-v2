const Sequelize = require("sequelize");

class UserTerm extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_term_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        term_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "term",
            key: "term_id",
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
        is_agreed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user_term",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.UserTerm.belongsTo(models.Term, { foreignKey: "term_id", sourceKey: "term_id" });
    // models.UserTerm.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
  }
}

module.exports = UserTerm;
