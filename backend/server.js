
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { randomUUID } = require("crypto");
const prisma = require("./src/prisma");
const supabase = require("./src/supabase");

const app = express();
const PORT = 3000;

// File upload configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only PDF and PowerPoint files are allowed!"));
    }
  },
});

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Test database connection
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send("Database connected successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed!");
  }
});

// Test Supabase connection
app.get("/storage-test", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      throw error;
    }

    res.json({
      message: "Supabase connected successfully!",
      buckets: data.map((bucket) => bucket.name),
    });
  } catch (error) {
    console.error("Supabase error:", error);

    res.status(500).json({
      message: "Supabase connection failed!",
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }
});

// Upload file to Supabase Storage
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file to upload.",
      });
    }

    const fileName = `${randomUUID()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from("materials")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: "File uploaded successfully!",
      fileName: req.file.originalname,
      filePath: data.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: "File upload failed!",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
