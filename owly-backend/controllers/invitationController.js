const { Invitation, Meeting, User } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getPendingInvitations = catchAsync(async (req, res, next) => {
  const pendingInvitations = await Invitation.findAll({
    attributes: ["id", "isAccepted"],
    where: {
      isAccepted: null,
      userParticipant: req.user.id,
    },
    include: [
      {
        model: User,
        as: "inviter",
        attributes: ["id", "firstname", "lastname", "email"],
      },
      {
        model: Meeting,
      },
    ],
  });

  res.status(200).json({ invitations: pendingInvitations });
});

exports.updateInvitation = catchAsync(async (req, res, next) => {
  const { id: invitationId } = req.params;

  const isAccepted =
    req.query.isAccepted !== undefined
      ? req.query.isAccepted.toLowerCase() === "true"
        ? true
        : false
      : null;

  const invitationToUpdate = await Invitation.findByPk(invitationId);
  if (!invitationToUpdate)
    return next(
      new AppError(`The invitation with ID ${invitationId} was not found`, 404)
    );

  if (
    invitationToUpdate.userParticipant === req.user.id &&
    isAccepted !== null
  ) {
    invitationToUpdate.isAccepted = isAccepted;
    await invitationToUpdate.save();
  } else if (invitationToUpdate.userParticipant !== req.user.id) {
    return next(new AppError("User can only update his own invitations"));
  }

  res.status(204).json({});
});
