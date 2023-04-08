"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Meeting }) {
      this.belongsTo(User, { foreignKey: "user_sender_fk" });
      this.belongsTo(User, { foreignKey: "user_participant_fk" });
      this.belongsTo(Meeting, { foreignKey: "meeting_fk" });
    }
  }
  Invitation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      isAccepted: DataTypes.BOOLEAN,
      userSender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_sender_fk",
      },
      userParticipant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_participant_fk",
      },
      meeting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "meeting_fk",
      },
    },
    {
      sequelize,
      modelName: "Invitation",
      tableName: "invitation",
      updatedAt: false,
      createdAt: false,
    }
  );
  return Invitation;
};
