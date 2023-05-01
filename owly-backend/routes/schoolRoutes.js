const express = require("express");

const router = express.Router();

router.use("/:schoolId/activities", require("./activitiesRoutes"));

module.exports = router;
