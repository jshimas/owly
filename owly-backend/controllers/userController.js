const catchAsync = require("../utils/catchAsync");
const { User, UserRole } = require("../models");

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.findAll({
    include: UserRole,
    attributes: {
      include: ["id", "firstname", "lastname", "email", "points", "school"],
    },
  });

  const usersJSON = users.map((user) => {
    user = user.toJSON();
    user.role = user.role?.role ?? null;
    return user;
  });

  res.status(200).json({ usersJSON });
});
