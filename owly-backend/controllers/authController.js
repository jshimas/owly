const jwt = require("jsonwebtoken");
const { User, School, UserRole } = require("../models");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (userId, statusCode, res) => {
  const token = signToken(userId);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(statusCode).json({ userId, token });
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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password is provided
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists & password is correct
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything is ok, send token to client
  createSendToken(user.id, 200, res);
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    next();
  };

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's provided
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );
  }

  // 2) Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  let currentUser = await User.findByPk(decoded.id, { include: UserRole });
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  currentUser = currentUser.toJSON();
  currentUser.role = currentUser.role.role;
  req.user = currentUser;
  next();
});
