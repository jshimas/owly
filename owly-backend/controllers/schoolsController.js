const { Sequelize } = require("sequelize");
const { School, Activity, User } = require("../models");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const assignSchoolLevel = require("../utils/assignSchoolLevel");

exports.getSchool = catchAsync(async (req, res, next) => {
  const { id: schoolId } = req.params;

  const school = await School.findByPk(schoolId);

  if (!school) {
    return next(new AppError(`School with ID ${schoolId} was not found.`, 404));
  }

  // Count school activities
  const { count: activitiesCount } = await Activity.findAndCountAll({
    where: {
      schoolId: schoolId,
    },
  });

  // Count school themes
  const schoolThemes = await Activity.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("theme")), "theme"]],
    where: {
      schoolId: schoolId,
    },
  });

  // Count school students
  const { count: studentsCount } = await User.findAndCountAll({
    where: {
      schoolId: schoolId,
      roleId: 1, // 1 - member
    },
  });

  const schoolLevel = assignSchoolLevel(
    activitiesCount,
    schoolThemes.length,
    studentsCount
  );

  const schoolData = {
    ...school.toJSON(),
    themesQuantity: schoolThemes.length,
    activitiesQuantity: activitiesCount,
    studentsQuantity: studentsCount,
    level: schoolLevel,
  };

  res.status(200).json({ schoolData });
});
