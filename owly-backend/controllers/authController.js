const jwt = require("jsonwebtoken");
const { User, School } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (userId, statusCode, res) => {
  const token = signToken(userId);

  console.log("token: ", token);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(statusCode).json({ userId });
};

exports.signup = catchAsync(async (req, res, next) => {
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
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    school: req.body.school,
  });

  createSendToken(newUser.id, 201, res);
});
