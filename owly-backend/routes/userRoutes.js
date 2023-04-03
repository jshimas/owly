const express = require("express");
const usersController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(usersController.getAllUser);

module.exports = router;
