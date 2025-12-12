const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());

// MongoDB connection
let isConnected = false;

async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) return;

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI not set");
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
}

// Database middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Error:", error.message);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// Import routes
const authRoutes = require("../src/routes/authRoutes.js");
const adminAuthRoutes = require("../src/routes/adminAuth.js");
const eventRoutes = require("../src/routes/eventRoutes.js");
const bookingAndTicketRoutes = require("../src/routes/bookingAndTicketRoutes.js");
const analyticsRoutes = require("../src/routes/analyticsRoutes.js");
const messageRoutes = require("../src/routes/messageRoutes.js");
const adminListRoutes = require("../src/routes/adminListRoutes.js");
const dashboardStatsRoutes = require("../src/routes/dashboardStatsRoutes.js");
const optimizedRoutes = require("../src/routes/optimizedRoutes.js");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", bookingAndTicketRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", messageRoutes);
app.use("/api", adminListRoutes);
app.use("/api", dashboardStatsRoutes);
app.use("/api/optimized", optimizedRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Root
app.get("/", (req, res) => {
    res.json({ message: "EventX Studio API", status: "running" });
});

// 404
app.use((req, res) => {
    res.status(404).json({ path: req.path, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;
