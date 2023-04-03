const catchAsync = require("../utils/catchAsync");
const { User } = require("../models");

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({ users });
});
