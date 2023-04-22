"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supervisor extends Model {
    static associate(models) {
      // define association here
    }
  }
  Supervisor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      modelName: "Supervisor",
      tableName: "supervisor",
      timestamps: false,
    }
  );
  return Supervisor;
};
