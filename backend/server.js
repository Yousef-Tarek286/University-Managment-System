require("dotenv/config");
const express = require("express");
const cors = require("cors");

const courseRoutes = require("./src/routes/course.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend server is running!");
});

// Mount feature routes
app.use("/api/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
