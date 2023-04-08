"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResourceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Resource }) {
      this.hasMany(Resource, { foreignKey: "type_fk" });
    }
  }
  ResourceType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResourceType",
      tableName: "resource_type",
      updatedAt: false,
      createdAt: false,
    }
  );
  return ResourceType;
};
