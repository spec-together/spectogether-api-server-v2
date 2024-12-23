const { Model, DataTypes, Sequelize } = require("sequelize");

class School extends Model {
  static init(sequelize) {
    return super.init(
      {
        school_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        domain: {
          type: DataTypes.STRING(512),
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
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "school",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.UserSchool, {
      as: "user_schools",
      foreignKey: "school_id",
    });
  }
}

module.exports = School;
