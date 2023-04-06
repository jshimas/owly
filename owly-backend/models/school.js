"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    static associate(models) {
      // define association here
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
      tableName: "school",
      updatedAt: false,
      createdAt: false,
    }
  );
  return School;
};
