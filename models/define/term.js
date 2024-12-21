const Sequelize = require("sequelize");

class Term extends Sequelize.Model {
  static init(sequelize, DataTypes) {
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
      },
      {
        sequelize,
        tableName: "term",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // models.Term.hasMany(models.User, {foreignKey: "term_id",sourceKey: "term_id"});
  }
}

module.exports = Term;
