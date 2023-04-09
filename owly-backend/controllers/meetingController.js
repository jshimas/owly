const { Meeting, User, Resource, ResourceType } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getMeeting = catchAsync(async (req, res, next) => {
  const { meetingId } = req.params;

  const meeting = await Meeting.findByPk(meetingId, {
    include: [
      {
        model: User,
        as: "members",
        attributes: ["id", "firstname", "lastname", "email", "role"],
        through: {
          attributes: ["id", "isAccepted"],
          as: "invitation",
        },
      },
      {
        model: Resource,
        // include: ResourceType,
        attributes: ["id", "filepath"],
      },
    ],
  });

  if (!meeting)
    return next(
      new AppError(`The meeting with ID ${meetingId} does not exist`, 404)
    );

  res.status(200).json({ meeting });
});
