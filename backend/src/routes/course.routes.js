// =================================================================
// routes/course.routes.js — API Endpoints for Courses
//
// Mounted at /api/courses in server.js
// =================================================================


import express from "express";
import courseController from "../controllers/course.controller.js";

const router = express.Router();

// GET /api/courses/semesters
router.get("/semesters", courseController.getSemesters);

// GET /api/courses
router.get("/", courseController.getCourses);

// GET /api/courses/:id
router.get("/:id", courseController.getCourseById);

export default router;
