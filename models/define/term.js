const { Model, DataTypes } = require("sequelize");

class Term extends Model {
  static init(sequelize) {
    super.init(
      {
        term_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
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
          type: DataTypes.STRING(50),
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
        tableName: "term",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Term.hasMany(models.UserTerm, { foreignKey: "term_id" });
  }
}

module.exports = Term;
