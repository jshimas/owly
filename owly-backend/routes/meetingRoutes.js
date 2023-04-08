const express = require("express");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

router.route("/:meetingId").get(meetingController.getMeeting);

module.exports = router;
