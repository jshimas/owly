const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  School,
  Activity,
  Supervisor,
  User,
  Image,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const deleteFilesThatStartsWith = require("../utils/deleteFilesThatStartWith");

// Define the storage and file limits
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/images/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `activity-${req.params.activityId}-${Date.now()}-${file.originalname}`
    );
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

// Create the Multer middleware instance
exports.uploadImages = multer({ storage, limits }).array("images");

exports.getAllActivities = catchAsync(async (req, res, next) => {
  const { schoolId } = req.params;

  const school = await School.findByPk(schoolId, {
    include: {
      model: Activity,
      attributes: [
        "id",
        "theme",
        "name",
        "approved",
        "startDate",
        "endDate",
        "reason",
        "goal",
        "result",
        "resources",
      ],
    },
  });

  if (!school) {
    return next(new AppError(`School with ID ${schoolId} was not found.`, 404));
  }

  res.status(200).json({ activities: school.toJSON().activities });
});

exports.getActivity = catchAsync(async (req, res, next) => {
  const { schoolId, activityId } = req.params;

  const school = await School.findByPk(schoolId);

  if (!school) {
    return next(new AppError(`School with ID ${schoolId} was not found.`, 404));
  }

  const activity = await Activity.findOne({
    attributes: { exclude: ["user_creator_fk", "school_fk"] },
    where: {
      [Op.and]: {
        id: activityId,
        schoolId: schoolId,
      },
    },
    include: [
      {
        model: Image,
        attributes: ["id", "filepath"],
      },
      {
        model: User,
        as: "supervisors",
        attributes: ["id", "firstname", "lastname", "email"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!activity) {
    return next(
      new AppError(
        `Activity with ID ${activityId} was not found at specified school.`,
        404
      )
    );
  }

  res.status(200).json({ activity: activity });
});

exports.checkSupervisorPermission = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;

  const supervisor = await Supervisor.findOne({
    where: {
      [Op.and]: {
        userId: req.user.id,
        activityId: activityId,
      },
    },
  });

  if (!supervisor || !["admin", "coordinator"].includes(req.user.role)) {
    return next(
      new AppError(
        "You do not have the supervisor role to perform update on this activity",
        401
      )
    );
  }

  next();
});

exports.activityBodyValidation = catchAsync(async (req, res, next) => {
  const supervisorsIds = req.body.supervisorsIds || [];

  const usersIds = [...new Set(supervisorsIds)];

  // Checking if all the users exists
  if (usersIds && usersIds.length > 0) {
    const existingUsers = await User.findAll({
      where: {
        id: usersIds,
      },
    });
    const existingUserIds = existingUsers.map((user) => user.id);
    const invalidUserIds = usersIds.filter(
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

exports.createActivity = catchAsync(async (req, res, next) => {
  const { supervisorsIds } = req.body;
  delete req.body.supervisorsIds;
  const activityBody = {
    ...req.body,
    approved: req.user.role !== "member" ? true : null,
    creatorId: req.user.id,
    schoolId: req.params.schoolId,
  };

  const newActivity = await sequelize.transaction(async (t) => {
    const activity = await Activity.create(activityBody, { transaction: t });

    supervisorsIds.push(req.user.id);
    const supervisorsToCreate = supervisorsIds.map((sId) => ({
      userId: sId,
      activityId: activity.id,
    }));

    await Supervisor.bulkCreate(supervisorsToCreate, { transaction: t });

    return activity;
  });

  res.status(201).json({
    URI: `/schools/${newActivity.schoolId}/activities/${newActivity.id}`,
  });
});

exports.updateActivity = catchAsync(async (req, res, next) => {
  const { schoolId, activityId } = req.params;

  const school = await School.findByPk(schoolId);

  if (!school) {
    return next(new AppError(`School with ID ${schoolId} was not found.`, 404));
  }

  const activityToUpdate = await Activity.findOne({
    where: {
      [Op.and]: {
        id: activityId,
        schoolId: schoolId,
      },
    },
  });

  if (!activityToUpdate) {
    return next(
      new AppError(
        `Activity with ID ${activityId} was not found at specified school.`,
        404
      )
    );
  }

  await sequelize.transaction(async (t) => {
    await activityToUpdate.update({ ...req.body }, { transaction: t });

    if (req.files && req.files.length > 0) {
      await Image.destroy({
        where: { activityId: activityId },
        transaction: t,
      });

      const imagesToCreate = req.files.map((image) => ({
        filepath: image.path,
        activityId: activityId,
      }));

      await Image.bulkCreate(imagesToCreate, { transaction: t });
    }
  });

  await deleteFilesThatStartsWith(`activity-${req.params.id}`);
  res.status(204).json({});
});
