// =================================================================
// controllers/course.controller.js — HTTP Request Handlers
//
// Controllers read query/body parameters from req, call the service,
// and send a consistent JSON response back to the frontend.
// =================================================================

import courseService from "../services/course.service.js";

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

const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
    });
  }
};

export default {
  getCourses,
  getSemesters,
  getCourseById,
};
