const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/create-password/:token", userController.createPassword);

// All further routes are protected from unauthorized use
router.use(authController.protect);

router.post(
  "/",
  authController.restrictTo("coordinator", "admin"),
  userController.createUser
);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUser);
// .post(userController.createUser);

module.exports = router;
