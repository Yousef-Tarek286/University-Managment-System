import express from "express";
import multer from "multer";
import path from "path";
import materialController from "../controllers/material.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set([".pdf", ".ppt", ".pptx"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error("Only PDF and PowerPoint (.pdf, .ppt, .pptx) files are allowed"));
    }
    cb(null, true);
  },
});

const handleFileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "File size exceeds the 10 MB limit"
          : err.message || "Invalid file upload";
      return res.status(400).json({
        success: false,
        message,
      });
    }
    next();
  });
};

// GET /api/courses/:id/materials
router.get(
  "/courses/:id/materials",
  authenticateToken,
  materialController.getCourseMaterials
);

// POST /api/courses/:id/materials
router.post(
  "/courses/:id/materials",
  authenticateToken,
  authorizeRole("DOCTOR", "ADMIN"),
  handleFileUpload,
  materialController.uploadMaterial
);

// GET /api/materials/:id/download
router.get(
  "/materials/:id/download",
  authenticateToken,
  materialController.downloadMaterial
);

// DELETE /api/materials/:id
router.delete(
  "/materials/:id",
  authenticateToken,
  authorizeRole("DOCTOR", "ADMIN"),
  materialController.deleteMaterial
);

export default router;
