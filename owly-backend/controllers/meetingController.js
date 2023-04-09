const { Meeting, User, Resource, Invitation } = require("../models");
const { Op } = require("sequelize");

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

exports.getAllMeetings = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findByPk(userId);
  if (!user)
    return next(new AppError(`The user with ID ${userId} does not exist`, 404));

  const isFinishedWhereClause =
    req.query.isFinished !== undefined
      ? req.query.isFinished.toLowerCase() === "true"
        ? { isFinished: true }
        : { isFinished: false }
      : {};

  const meetings = await Meeting.findAll({
    attributes: ["id", "startDate", "isFinished", "subject", "summary"],
    where: isFinishedWhereClause,
    include: [
      {
        model: Invitation,
        as: "invitations",
        attributes: [],
        where: {
          userParticipant: userId,
        },
      },
    ],
  });

  res.status(200).json({ meetings });
});

exports.createMeeting = catchAsync(async (req, res, next) => {
  const { meeting } = req.body;

  const currentDate = new Date();
  if (new Date(meeting.startDate) < currentDate) {
    return next(new AppError("The startDate should be in the future", 400));
  }

  const newMeeting = await Meeting.create(meeting);

  Promise.all(
    meeting.participants.map(async (participantId) => {
      const existingUser = await User.findByPk(participantId);

      if (!existingUser)
        return new AppError(`The user with ID ${participantId} does not exist`);

      await Invitation.create({
        userSender: req.user.id,
        userParticipant: participantId,
        meetingId: newMeeting.id,
      });
    })
  );

  res.status(201).json({ message: "Meeting was successfully created" });
});
