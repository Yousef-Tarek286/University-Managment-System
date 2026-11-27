// =================================================================
// controllers/enrollment.controller.js — HTTP Handlers for Enrollment
// =================================================================

const enrollmentService = require("../services/enrollment.service");

/**
 * POST /api/enrollments
 * Body: { courseId }
 */
const register = async (req, res, next) => {
  try {
    const result = await enrollmentService.registerForCourse({
      studentId: req.user.id, // Always trust verified JWT user, never req.body
      courseId: req.body?.courseId,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${result.course.courseCode}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/enrollments/my-courses
 */
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await enrollmentService.getMyCourses(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/enrollments/:id
 */
const dropCourse = async (req, res, next) => {
  try {
    const result = await enrollmentService.dropCourse({
      enrollmentId: req.params.id,
      studentId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Course dropped successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  getMyCourses,
  dropCourse,
};
