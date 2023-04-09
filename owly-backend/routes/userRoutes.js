const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.route("/").get(userController.getAllUser);
router.get("/:id/meetings", meetingController.getAllMeetings);

module.exports = router;
