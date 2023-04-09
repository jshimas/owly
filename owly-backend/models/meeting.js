"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Resource, User, Invitation }) {
      this.hasMany(Resource, { foreignKey: "meeting_fk" });
      this.hasMany(Invitation, { foreignKey: "meeting_fk" });

      this.belongsToMany(User, {
        through: {
          model: "Invitation",
          unique: false,
        },
        as: "members",
        foreignKey: "meeting_fk",
        otherKey: "user_participant_fk",
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
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "start_date",
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_finished",
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
  return Meeting;
};
