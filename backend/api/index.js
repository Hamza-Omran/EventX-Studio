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
    if (isConnected) return;

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI not set");
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
}

// Health check (no DB required)
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        env: {
            MONGO_URI: process.env.MONGO_URI ? "set" : "NOT SET",
            JWT_SECRET: process.env.JWT_SECRET ? "set" : "NOT SET"
        },
        timestamp: new Date().toISOString()
    });
});

// Test DB connection
app.get("/api/test-db", async (req, res) => {
    try {
        await connectDB();
        res.json({ status: "connected", message: "MongoDB works!" });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
});

// Root
app.get("/", (req, res) => {
    res.json({ message: "EventX Studio API" });
});

// 404
app.use((req, res) => {
    res.status(404).json({ path: req.path, message: "Not found" });
});

module.exports = app;
