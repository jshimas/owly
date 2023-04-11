const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const meetingController = require("../controllers/meetingController");
const invitationController = require("../controllers/invitationController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// All further routes are protected from unauthorized use
router.use(authController.protect);

// MEETINGS
router.get(
  "/:id/meetings",
  authController.restrictTo("coordinator", "admin"),
  meetingController.getAllMeetings
);

router.post(
  "/",
  authController.restrictTo("coordinator", "admin"),
  meetingController.createMeeting
);

router.get("/", authController.restrictTo("admin"), userController.getAllUser);

module.exports = router;
