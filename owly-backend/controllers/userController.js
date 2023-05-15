const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Email = require("../utils/email");
const { User, UserRole, School, PasswordReset } = require("../models");
const createSendToken = require("../utils/createSendToken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.getAllUser = catchAsync(async (req, res) => {
  console.log(req.user);
  const users = await User.findAll({
    include: UserRole,
    attributes: {
      include: ["id", "firstname", "lastname", "email"],
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
  // Vlaidating if user does not already exist and the school is valid
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  const existingSchool = await School.findByPk(req.body.schoolId);

  if (existingUser)
    return next(
      new AppError("User already exist with the provided email.", 400)
    );

  if (!existingSchool)
    return next(new AppError("Provided school not found.", 404));

  // Creating new user
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    schoolId: req.body.schoolId,
    roleId: req.body.roleId,
  });

  // Creating password reset token
  const token = crypto.randomBytes(32).toString("hex");
  console.log(User);
  console.log(PasswordReset);
  await PasswordReset.create({
    email: newUser.email,
    token,
  });

  // Sending user token to create a new password
  try {
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/create-password/${token}`;

    const newUserJson = newUser.toJSON();
    await new Email(req.user, newUserJson, URL).sendPasswordCreate();

    res.status(200).json({
      message: `Email was sent to ${newUserJson.email} to create an account password`,
      userId: newUser.toJSON().id,
    });
  } catch (err) {
    await newUser.destroy();

    return next(
      new AppError(
        "There was an errorr sending an email. Try creating user later!",
        500
      )
    );
  }
});

exports.createPassword = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError(`Passwords do not match`, 400));
  }

  // Look up the password reset token
  const resetToken = await PasswordReset.findOne({
    where: { email, token: req.params.token },
    order: [["createdAt", "DESC"]],
  });

  if (!resetToken) {
    return next(new AppError(`Invalid token`, 400));
  }

  // Update the user's password
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(
      new AppError(
        `Sorry but the account with email: ${email} is no  longer valid`,
        400
      )
    );
  }

  user.password = await bcrypt.hash(password, 12);
  await user.save();

  // Delete the password reset token
  await resetToken.destroy();

  // 4) Log the user in, send JWT
  createSendToken(user.id, 200, res);
});

exports.getUser = catchAsync(async (req, res, next) => {

  const user = await User.findByPk(req.params.id, {
    include: UserRole,
    attributes: {
      include: ["id", "firstname", "lastname", "email", "school_fk"],
    },
  });

  if (!user) return next(new AppError("User not found", 404));

  const userJSON = user.toJSON();
  userJSON.role = userJSON.role?.role ?? null;

  delete userJSON["schoolId"]
  delete userJSON["password"]
  delete userJSON["roleId"]

  res.status(200).json({ userJSON });

});

exports.updateUser = catchAsync(async (req, res, next) => {

  const user = await User.findByPk(req.params.id);

  if (!user) return next(new AppError(`The user with ID ${req.params.id} does not exist`, 404));

  const updatedUser = await User.update(req.body, { where: { id: req.params.id } });

  res.status(200).json({ updatedUser });


});

exports.getMe = catchAsync(async (req, res, next) => {

  let user = req.user;

  delete user["password"]

  delete user["schoolId"]

  delete user["roleId"]

  res.status(200).json({user: user});

});

exports.deleteUser = catchAsync(async (req, res, next) => {

  const user = await User.findByPk(req.params.id);

  if (!user) return next(new AppError(`The user with ID ${req.params.id} does not exist`, 404));

  const deletedUser = await User.destroy({ where: { id: req.params.id } });

  res.status(200).json({ deletedUser });


});