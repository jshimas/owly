"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init(
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
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      school: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "school_fk",
      },
      area: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "area_fk",
      },
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "event",
    }
  );
  return Event;
};
