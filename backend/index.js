const express = require("express");
const cors = require("cors");
const colors = require("colors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctor");

const appointmentRoute = require("./routes/appointment");
const adminRoutes = require("./routes/admin");
const patientRoutes = require("./routes/patient");

const app = express();

// ==============================
// Database Connection
// ==============================

connectDB();

// ==============================
// Middleware
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running successfully",
  });
});

// ==============================
// API Routes
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);

// ==============================
// 404 Route
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==============================
// Server Start
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});