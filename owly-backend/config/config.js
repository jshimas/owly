require("dotenv").config();
module.exports = {
  development: {
    database: "owly",
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    // database: "teresaterroso__pw2_g10",
    // username: "teresaterroso__pw2_g10",
    // password: "umyDEy)2_oNz",
    // host: "pw2.joaoferreira.eu",
    // dialect: "mysql",
  },
};
