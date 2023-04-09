const express = require("express");
const meetingController = require("../controllers/meetingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("coordinator", "admin"));

router.route("/").post(meetingController.createMeeting);
router.route("/:meetingId").get(meetingController.getMeeting);

module.exports = router;
