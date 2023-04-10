const { sequelize, Meeting, User, Resource, Invitation } = require("../models");
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
        attributes: ["id", "firstname", "lastname", "email", "roleId"],
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

  const { membersIds } = meeting;

  // Checking if all the users exists
  const existingUsers = await User.findAll({
    where: {
      id: membersIds,
    },
  });
  const existingUserIds = existingUsers.map((user) => user.id);
  const invalidUserIds = membersIds.filter(
    (id) => !existingUserIds.includes(id)
  );
  if (invalidUserIds.length > 0) {
    return next(
      new AppError(
        `Following users with ids were not found: ${invalidUserIds.join(", ")}`,
        404
      )
    );
  }

  const newMeeting = await sequelize.transaction(async (t) => {
    const createdMeeting = await Meeting.create(meeting, { transaction: t });

    if (!membersIds.includes(req.user.id)) membersIds.push(req.user.id);

    await Promise.all(
      membersIds.map(async (memberId) => {
        await Invitation.create(
          {
            userSender: req.user.id,
            userParticipant: memberId,
            meetingId: createdMeeting.id,
            isAccepted: req.user.id === memberId ? true : null,
          },
          { transaction: t }
        );
      })
    );

    return createdMeeting;
  });

  res.status(201).json({
    message: "Meeting was successfully created",
    meetingId: newMeeting.id,
  });
});
