require("dotenv").config();
module.exports = {
  development: {
    database: "teresaterroso__pw2_g10",
    username: "teresaterroso__pw2_g10",
    password: "qip%ac.WSMu_",
    host: "pw2.joaoferreira.eu",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "root",
    database: "owly",
    host: "localhost",
    dialect: "mysql",
  },
};
