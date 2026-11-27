import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "./src/config/prisma.js";
import courseRoutes from "./src/routes/course.routes.js";
import enrollmentRoutes from "./src/routes/enrollment.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";

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

// Login route (from Mohamed Osama's auth PR)
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

    // Generate JWT token
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

// Course & Enrollment routes
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Global error handler (must be registered last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
