"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate({ Meeting, ResourceType }) {
      this.belongsTo(Meeting, { foreignKey: "meeting_fk" });
      this.belongsTo(ResourceType, { foreignKey: "type_fk" });
    }
  }
  Resource.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event: {
        type: DataTypes.INTEGER,
        field: "event_fk",
      },
      activity: {
        type: DataTypes.INTEGER,
        field: "activity_fk",
      },
      meeting: {
        type: DataTypes.INTEGER,
        field: "meeting_fk",
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "type_fk",
      },
    },
    {
      sequelize,
      modelName: "Resource",
      tableName: "resource",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Resource;
};
