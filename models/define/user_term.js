const { DataTypes, Model, Sequelize } = require("sequelize");

class UserTerm extends Model {
  static init(sequelize) {
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
        tableName: "user_term",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Term, {
      as: "term",
      foreignKey: "term_id",
    });
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }
}

module.exports = UserTerm;
