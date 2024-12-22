const { Model, DataTypes, Sequelize } = require("sequelize");

class UserSchool extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_school_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        school_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "school",
            key: "school_id",
          },
        },
        email: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_public: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        tableName: "user_school",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
    this.belongsTo(models.School, {
      as: "school",
      foreignKey: "school_id",
    });
  }
}

module.exports = UserSchool;
