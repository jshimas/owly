const catchAsync = require("../utils/catchAsync");
const { User, UserRole } = require("../models");
const createSendToken = require("../utils/createSendToken");

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

exports.createUser = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  const existingSchool = await School.findByPk(req.body.school);

  if (existingUser)
    return next(
      new AppError("User already exist with the provided email.", 400)
    );

  if (!existingSchool)
    return next(new AppError("Provided school not found.", 404));

  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    schoolId: req.body.schoolId,
    roleId: req.body.roleId,
  });

  createSendToken(newUser.id, 201, res);
});
