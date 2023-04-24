const { sequelize, Meeting, User, Image, Participant } = require("../models");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const multer = require("multer");
const path = require("path");
const deleteFilesThatStartsWith = require("../utils/deleteFilesThatStartWith");

// Define the storage and file limits
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/files/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `meeting-${req.params.meetingId}-${Date.now()}-${file.originalname}`
    );
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

// Create the Multer middleware instance
exports.uploadFiles = multer({ storage, limits }).array("files");

exports.deleteOldFiles = catchAsync(async (req, res, next) => {
  await deleteFilesThatStartsWith(`meeting-${req.params.id}`);
  next();
});

exports.getMeeting = catchAsync(async (req, res, next) => {
  const { id: meetingId } = req.params;

  const meeting = await Meeting.findByPk(meetingId, {
    attributes: [
      "id",
      "subject",
      "date",
      "startTime",
      "endTime",
      "place",
      "notes",
    ],
    include: [
      {
        model: User,
        as: "participants",
        attributes: ["id", "firstname", "lastname", "email"],
        through: {
          attributes: ["editor"],
          as: "permissions",
        },
      },
      {
        model: Image,
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
  const isFinishedWhereClause =
    req.query.isFinished !== undefined
      ? req.query.isFinished.toLowerCase() === "true"
        ? { endTime: { [Op.not]: null } }
        : { endTime: null }
      : {};

  const meetings = await Meeting.findAll({
    attributes: ["id", "subject", "date", "startTime", "endTime", "place"],
    where: isFinishedWhereClause,
  });

  res.status(200).json({ meetings });
});

exports.meetingBodyValidation = catchAsync(async (req, res, next) => {
  const { editorsIds } = req.body;

  // Checking if all the users exists
  if (editorsIds && editorsIds.length > 0) {
    const existingUsers = await User.findAll({
      where: {
        id: editorsIds,
      },
    });
    const existingUserIds = existingUsers.map((user) => user.id);
    const invalidUserIds = editorsIds.filter(
      (id) => !existingUserIds.includes(id)
    );
    if (invalidUserIds.length > 0) {
      return next(
        new AppError(
          `Following users with ids were not found: ${invalidUserIds.join(
            ", "
          )}`,
          404
        )
      );
    }
  }

  next();
});

exports.createMeeting = catchAsync(async (req, res, next) => {
  const { editorsIds } = req.body;

  const meetingData = {
    ...req.body,
    coordinatorId: req.user.id,
  };

  const newMeeting = await sequelize.transaction(async (t) => {
    const createdMeeting = await Meeting.create(meetingData, {
      transaction: t,
    });

    if (!editorsIds.includes(req.user.id)) editorsIds.push(req.user.id);

    const editors = editorsIds.map((memberId) => ({
      editor: true,
      userId: memberId,
      meetingId: createdMeeting.id,
    }));

    console.log(editors);

    console.log(Participant);

    await Participant.bulkCreate(editors, { transaction: t });

    return createdMeeting;
  });

  res.status(201).json({
    message: "Meeting was successfully created",
    URI: `/meetings/${newMeeting.id}`,
  });
});

exports.updateMeeting = catchAsync(async (req, res, next) => {
  const { meetingId } = req.params;
  const { startDate, subject, summary, membersIds, isFinished } = req.body;

  const meetingToUpdate = await Meeting.findOne({ where: { id: meetingId } });
  if (!meetingToUpdate) {
    return next(new AppError(`Meeting with ID ${meetingId} not found`, 404));
  }

  // Updating the meeting
  await meetingToUpdate.update({
    startDate: startDate || meetingToUpdate.startDate,
    subject: subject || meetingToUpdate.subject,
    summary: summary || meetingToUpdate.summary,
    isFinished: isFinished || meetingToUpdate.isFinished,
  });

  // Updating invitations
  await Invitation.destroy({
    where: { [Op.and]: [{ isAccepted: false }, { meetingId: meetingId }] },
  });

  if (membersIds && membersIds.length > 0) {
    const invitationsToCreate = membersIds.map((memberId) => ({
      userSender: req.user.id,
      userParticipant: memberId,
      meetingId: meetingId,
    }));
    await Invitation.bulkCreate(invitationsToCreate);
  }

  // Creating resources
  if (req.files && req.files.length > 0) {
    await Resource.destroy({ where: { meetingId: meetingId } });
    const resourcesToCreate = req.files.map((file) => ({
      filepath: file.path,
      meetingId: meetingId,
    }));
    await Resource.bulkCreate(resourcesToCreate);
  }

  res.status(204);
});
