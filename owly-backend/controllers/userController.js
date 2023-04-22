const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Email = require("../utils/email");
const { User, UserRole, School } = require("../models");
const createSendToken = require("../utils/createSendToken");
const { Op } = require("../models");

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
  const existingSchool = await School.findByPk(req.body.schoolId);

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

  const passwordCreationToken = newUser.createPasswordCreateToken();
  await newUser.save();

  try {
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/create-password/${passwordCreationToken}`;

    const newUserJson = newUser.toJSON();
    await new Email(newUserJson, newUserJson, URL).sendPasswordCreate();

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
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      passwordCreateToken: hashedToken,
      passwordCreateExpires: { [Op.gt]: new Date() },
    },
  });

  // 2) If token has not expired, and there is a user, set a new password
  if (!user) {
    return next(new AppError("Token is invalid or expired.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user.id, 200, res);
});
