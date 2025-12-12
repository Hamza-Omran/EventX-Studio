const express = require("express");
const cors = require("cors");

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());

// Test endpoint
app.get("/", (req, res) => {
    res.json({
        message: "API is running",
        timestamp: new Date().toISOString(),
        env: {
            MONGO_URI: process.env.MONGO_URI ? "set" : "NOT SET",
            JWT_SECRET: process.env.JWT_SECRET ? "set" : "NOT SET",
            NODE_ENV: process.env.NODE_ENV || "NOT SET"
        }
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Catch all
app.use((req, res) => {
    res.status(404).json({ path: req.path, message: "Not found" });
});

module.exports = app;
