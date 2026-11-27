// =================================================================
// controllers/course.controller.js — HTTP Request Handlers
//
// Controllers read query/body parameters from req, call the service,
// and send a consistent JSON response back to the frontend.
// =================================================================

const courseService = require("../services/course.service");

/**
 * GET /api/courses?search=...&semesterId=...
 */
const getCourses = async (req, res) => {
  try {
    const { search, semesterId } = req.query;

    const courses = await courseService.getAvailableCourses({
      search,
      semesterId,
    });

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
    });
  }
};

/**
 * GET /api/courses/semesters
 */
const getSemesters = async (_req, res) => {
  try {
    const semesters = await courseService.getSemesters();
    return res.status(200).json({
      success: true,
      message: "Semesters retrieved successfully",
      data: semesters,
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve semesters",
    });
  }
};

module.exports = {
  getCourses,
  getSemesters,
};

