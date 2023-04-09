"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate({ User, Meeting }) {
      this.belongsTo(User, { foreignKey: "user_sender_fk" });
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
        references: {
          model: "User",
          key: "id",
        },
      },
      meeting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "meeting_fk",
        references: {
          model: "Meeting",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Invitation",
      tableName: "invitation",
      updatedAt: false,
      createdAt: false,
      name: { singular: "invitation", plural: "invitations" },
    }
  );
  return Invitation;
};
