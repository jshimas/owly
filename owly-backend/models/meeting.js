"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Resource }) {
      this.hasMany(Resource, { foreignKey: "meeting_fk" });
    }
  }
  meeting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Meeting",
      tableName: "meeting",
      updatedAt: false,
      createdAt: false,
    }
  );
  return meeting;
};
