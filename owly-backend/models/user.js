const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async isCorrectPassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }

    async createPassword(user) {
      user.password = await bcrypt.hash(user.password, 12);
      user.passwordConfirm = undefined;
    }

    createPasswordCreateToken() {
      const resetToken = crypto.randomBytes(32).toString("hex");

      this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      this.passwordResetExpires = Date.now() + 3 * 24 * 60 * 60 * 1000; // Expires in 5 days

      return resetToken;
    }

    static associate({ Meeting, UserRole, School, Activity }) {
      this.belongsToMany(Activity, {
        through: "Supervisor",
      });
      this.belongsToMany(Meeting, {
        through: {
          model: "Participant",
          unique: false,
        },
        as: "meetings",
        foreignKey: "user_fk",
        otherKey: "meeting_fk",
      });
      this.hasMany(Meeting, { foreignKey: "user_coordinator_fk" });
      this.belongsTo(UserRole);
      this.belongsTo(School, { foreignKey: "school_fk" });
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
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_fk",
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          min: 8,
        },
      },
      passwordConfirm: {
        type: DataTypes.VIRTUAL,
        validate: {
          isEqualToPassword(value) {
            if (value !== this.password)
              throw new Error("Passwords do not match.");
          },
        },
      },
      schoolId: {
        type: DataTypes.INTEGER,
        field: "school_fk",
      },
      passwordCreateToken: DataTypes.VIRTUAL,
      passwordCreateExpires: DataTypes.VIRTUAL,
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: false,
      name: { singular: "user", plural: "users" },
    }
  );

  return User;
};
