"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Image, User }) {
      this.hasMany(Image);
      this.belongsTo(User, {
        foreignKey: "user_coordinator_fk",
        as: "coordinator",
      });

      this.belongsToMany(User, {
        through: {
          model: "Participant",
          unique: false,
        },
        as: "participants",
        foreignKey: "meeting_fk",
        otherKey: "user_fk",
      });
    }
  }
  Meeting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "start_time",
      },
      endTime: {
        type: DataTypes.DATE,
        field: "start_time",
      },
      place: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      coordinatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_coordinator_fk",
      },
    },
    {
      sequelize,
      modelName: "Meeting",
      tableName: "meeting",
      updatedAt: false,
      createdAt: false,
      name: { singular: "meeting", plural: "meetings" },
    }
  );
  return Meeting;
};
