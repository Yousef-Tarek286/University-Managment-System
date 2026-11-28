// =================================================================
// controllers/enrollment.controller.js — HTTP Handlers for Enrollment
// =================================================================

import * as enrollmentService from "../services/enrollment.service.js";

/**
 * GET /api/enrollments/my-courses
 */
const getMyCourses = async (req, res) => {
  try {
    const courses = await enrollmentService.getMyCourses(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve enrolled courses",
    });
  }
};

export { getMyCourses };
