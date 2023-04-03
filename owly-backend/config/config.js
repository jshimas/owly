require("dotenv").config();
module.exports = {
  development: {
    database: "owly",
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  },
};
