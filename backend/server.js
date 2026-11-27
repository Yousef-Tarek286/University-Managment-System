import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./src/config/prisma.js";
import courseRoutes from "./src/routes/course.routes.js";
import materialRoutes from "./src/routes/material.routes.js";

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET =
  process.env.JWT_SECRET || "university_super_secret_jwt_key_2026";

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (_req, res) => {
  res.send("Backend server is running!");
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: `Welcome ${user.fullName}`,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Course & Material routes
app.use("/api/courses", courseRoutes);
app.use("/api", materialRoutes);

// 1. Create an announcement (course-specific or system-wide)
app.post("/api/announcements", async (req, res) => {
    try {
        const { title, content, courseId, createdById } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                courseId: courseId ? Number(courseId) : null,
                createdById: Number(createdById) || 1,
            },
            include: {
                createdBy: { select: { fullName: true, role: true } },
            },
        });

        return res.status(201).json(announcement);
    } catch (error) {
        console.error("Create announcement error:", error);
        return res.status(500).json({ error: "Failed to create announcement" });
    }
});

// 2. Get announcements for a specific course
app.get("/api/courses/:id/announcements", async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const announcements = await prisma.announcement.findMany({
            where: { courseId },
            include: {
                createdBy: { select: { fullName: true, role: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(announcements);
    } catch (error) {
        console.error("Get course announcements error:", error);
        return res.status(500).json({ error: "Failed to fetch announcements" });
    }
});

// 3. Get announcements feed (system-wide + enrolled courses)
app.get("/api/announcements/feed", async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            include: {
                createdBy: { select: { fullName: true, role: true } },
                course: { select: { code: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(announcements);
    } catch (error) {
        console.error("Get announcements feed error:", error);
        return res.status(500).json({ error: "Failed to fetch feed" });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
