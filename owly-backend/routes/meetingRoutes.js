const express = require("express");
const meetingController = require("../controllers/meetingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("coordinator", "admin"));

router
  .route("/")
  .post(
    meetingController.meetingBodyValidation,
    meetingController.createMeeting
  );

router
  .route("/:id")
  .get(meetingController.getMeeting)
  .patch(
    meetingController.meetingBodyValidation,
    meetingController.deleteOldFiles,
    meetingController.uploadFiles,
    meetingController.updateMeeting
  );

module.exports = router;
