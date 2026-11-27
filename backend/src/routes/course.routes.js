// =================================================================
// routes/course.routes.js — API Endpoints for Courses
//
// Mounted at /api/courses in server.js
// =================================================================

const express = require("express");
const courseController = require("../controllers/course.controller");

const router = express.Router();

// GET /api/courses/semesters — list semesters for the filter dropdown
router.get("/semesters", courseController.getSemesters);

// GET /api/courses — list active courses (supports ?search= and ?semesterId=)
router.get("/", courseController.getCourses);

module.exports = router;

