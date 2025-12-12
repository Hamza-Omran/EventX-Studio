const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

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

const app = express();

// MongoDB connection caching for serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not set");
    }

    try {
        await mongoose.connect(mongoUri, {
            bufferCommands: false,
        });
        cachedDb = mongoose.connection;
        console.log("MongoDB Connected");
        return cachedDb;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration - allow all origins for Vercel
app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

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

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "not configured",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "EventX Studio API",
        status: "running",
        endpoints: {
            health: "/api/health",
            auth: "/api/auth",
            events: "/api/events"
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
});

// Export the Express app for Vercel
module.exports = app;
