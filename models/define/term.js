const { DataTypes, Model, Sequelize } = require("sequelize");

class Term extends Model {
  static init(sequelize) {
    return super.init(
      {
        term_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_required: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        term_version: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
        tableName: "term",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.UserTerm, {
      as: "user_terms",
      foreignKey: "term_id",
    });
  }
}

module.exports = Term;
