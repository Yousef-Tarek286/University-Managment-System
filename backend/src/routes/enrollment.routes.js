// =================================================================
// routes/enrollment.routes.js — API Endpoints for Student Enrollment
//
// Mounted at /api/enrollments in server.js.
// All endpoints require an authenticated, active STUDENT.
// =================================================================

import express from "express";
import * as enrollmentController from "../controllers/enrollment.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect every route in this router
router.use(authenticateToken, authorizeRole("STUDENT"));

// GET /api/enrollments/my-courses — list student's active enrollments
router.get("/my-courses", enrollmentController.getMyCourses);

// POST /api/enrollments — enroll in a course ({ courseId })
router.post("/", enrollmentController.register);

// DELETE /api/enrollments/:id — drop an active enrollment
router.delete("/:id", enrollmentController.dropCourse);

export default router;
