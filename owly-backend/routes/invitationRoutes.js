const express = require("express");
const authController = require("../controllers/authController");
const invitationController = require("../controllers/invitationController");

const router = express.Router();

router.get(
  "/",
  authController.protect,
  invitationController.getPendingInvitations
);
router.patch(
  "/:id",
  authController.protect,
  invitationController.updateInvitation
);

module.exports = router;
