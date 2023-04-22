"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    static associate({ User }) {
      this.hasMany(User, { foreignKey: "school_fk" });
    }
  }
  School.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "project_name",
      },
    },
    {
      sequelize,
      modelName: "School",
      tableName: "schools",
      timestamps: false,
    }
  );
  return School;
};
