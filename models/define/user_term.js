const { Model, DataTypes } = require("sequelize");

class UserTerm extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_term_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        term_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        is_agreed: {
          type: DataTypes.BOOLEAN,
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
        tableName: "user_term",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    UserTerm.belongsTo(models.User, { foreignKey: "user_id" });
    UserTerm.belongsTo(models.Term, { foreignKey: "term_id" });
  }
}

module.exports = UserTerm;
