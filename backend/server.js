
import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import courseRoutes from "./src/routes/course.routes.js";

// Initialize Prisma
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
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

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

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
            process.env.JWT_SECRET,
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

// Course routes
app.use("/api/courses", courseRoutes);

// File upload setup
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });
const memoryUpload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    return res.status(200).json({
        message: "File uploaded successfully!",
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
    });
});
// 1. Upload a material to a course (Supabase Storage)
app.post("/api/courses/:id/materials", memoryUpload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const courseId = Number(req.params.id);
        const { title, description, uploadedById } = req.body;
        const storagePath = `courses/${courseId}/${Date.now()}-${req.file.originalname}`;

        const { error: uploadError } = await supabase.storage
            .from("materials")
            .upload(storagePath, req.file.buffer, {
                contentType: req.file.mimetype,
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return res.status(500).json({ error: uploadError.message });
        }

        const material = await prisma.courseMaterial.create({
            data: {
                title: title || req.file.originalname,
                description: description || null,
                fileName: req.file.originalname,
                filePath: storagePath,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                courseId,
                uploadedById: Number(uploadedById) || 1,
            },
        });

        return res.status(201).json(material);
    } catch (error) {
        console.error("Upload material error:", error);
        return res.status(500).json({ error: "Failed to upload material" });
    }
});

// 2. Get all materials for a course
app.get("/api/courses/:id/materials", async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const materials = await prisma.courseMaterial.findMany({
            where: { courseId },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(materials);
    } catch (error) {
        console.error("Get materials error:", error);
        return res.status(500).json({ error: "Failed to fetch materials" });
    }
});

// 3. Download a material by ID
app.get("/api/materials/:id/download", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const material = await prisma.courseMaterial.findUnique({ where: { id } });

        if (!material) {
            return res.status(404).json({ error: "Material not found" });
        }

        const { data, error } = await supabase.storage
            .from("materials")
            .createSignedUrl(material.filePath, 60, {
                download: material.fileName,
            });

        if (error || !data?.signedUrl) {
            return res.status(500).json({ error: "Failed to generate download link" });
        }

        return res.redirect(data.signedUrl);
    } catch (error) {
        console.error("Download material error:", error);
        return res.status(500).json({ error: "Failed to download material" });
    }
});

// 4. Delete a material by ID
app.delete("/api/materials/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const material = await prisma.courseMaterial.findUnique({ where: { id } });

        if (!material) {
            return res.status(404).json({ error: "Material not found" });
        }

        await supabase.storage.from("materials").remove([material.filePath]);
        await prisma.courseMaterial.delete({ where: { id } });

        return res.status(200).json({ message: "Material deleted" });
    } catch (error) {
        console.error("Delete material error:", error);
        return res.status(500).json({ error: "Failed to delete material" });
    }
});

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
