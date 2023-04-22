const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const meetingController = require("../controllers/meetingController");
const invitationController = require("../controllers/invitationController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/", userController.createUser);

// All further routes are protected from unauthorized use
router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUser);
// .post(userController.createUser);

module.exports = router;
