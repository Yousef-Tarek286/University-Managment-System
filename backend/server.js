
import express from "express";
import cors from "cors";
import "dotenv/config";

import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";



// Initialize Prisma
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Initialize Express
const app = express();
const PORT = 3000;

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
        const { username, password } = req.body;

        // Check Admin table
        let user = await prisma.admin.findUnique({
            where: { username },
        });

        let role = "admin";

        // Check Doctor table if not found
        if (!user) {
            user = await prisma.doctor.findUnique({
                where: { username },
            });

            role = "doctor";
        }

        // Check Student table if not found
        if (!user) {
            user = await prisma.student.findUnique({
                where: { username },
            });

            role = "student";
        }

        // Validate credentials
        if (!user || user.password !== password) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // Successful login
        return res.status(200).json({
            message: `Welcome ${user.name}`,
            role: role,
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
