const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.options('*', cors());

// MongoDB connection caching
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log("Using cached connection");
        return;
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI not set");
        throw new Error("MONGO_URI not set");
    }

    try {
        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB error:", err.message);
        throw err;
    }
}

// Simple test endpoint (no DB required)
app.get("/", (req, res) => {
    res.json({ message: "API is running", timestamp: new Date().toISOString() });
});

// Health check (no DB required)
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        mongoUri: process.env.MONGO_URI ? "set" : "not set",
        nodeEnv: process.env.NODE_ENV || "not set"
    });
});

// Import routes only after basic setup
let routesLoaded = false;

app.use(async (req, res, next) => {
    // Skip route loading for health check
    if (req.path === "/" || req.path === "/api/health") {
        return next();
    }

    try {
        // Connect to DB
        await connectDB();

        // Load routes if not loaded
        if (!routesLoaded) {
            const authRoutes = require("../src/routes/authRoutes.js");
            const adminAuthRoutes = require("../src/routes/adminAuth.js");
            const eventRoutes = require("../src/routes/eventRoutes.js");
            const bookingAndTicketRoutes = require("../src/routes/bookingAndTicketRoutes.js");
            const analyticsRoutes = require("../src/routes/analyticsRoutes.js");
            const messageRoutes = require("../src/routes/messageRoutes.js");
            const adminListRoutes = require("../src/routes/adminListRoutes.js");
            const dashboardStatsRoutes = require("../src/routes/dashboardStatsRoutes.js");
            const optimizedRoutes = require("../src/routes/optimizedRoutes.js");

            app.use("/api/auth", authRoutes);
            app.use("/api/admin-auth", adminAuthRoutes);
            app.use("/api/events", eventRoutes);
            app.use("/api", bookingAndTicketRoutes);
            app.use("/api", analyticsRoutes);
            app.use("/api", messageRoutes);
            app.use("/api", adminListRoutes);
            app.use("/api", dashboardStatsRoutes);
            app.use("/api/optimized", optimizedRoutes);

            routesLoaded = true;
        }

        next();
    } catch (error) {
        console.error("Middleware error:", error.message);
        res.status(500).json({ message: "Server initialization error", error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;
