const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async isCorrectPassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }

    static associate({ Meeting, Invitation }) {
      this.belongsToMany(Meeting, {
        through: "Invitation",
        as: "meetings",
        foreignKey: "user_participant_fk",
        otherKey: "meeting_fk",
      });

      this.hasMany(Invitation, {
        foreignKey: "user_sender_fk",
        as: "invitations",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: { msg: "Email is in a wrong format" },
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        field: "role_fk",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      passwordConfirm: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          isEqualToPassword(value) {
            if (value !== this.password)
              throw new Error("Passwords do not match.");
          },
        },
      },
      school: {
        type: DataTypes.INTEGER,
        field: "school_fk",
      },
    },
    {
      sequelize,
      tableName: "user",
      modelName: "User",
      createdAt: false,
      updatedAt: false,
    }
  );

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = undefined;
  });

  return User;
};
