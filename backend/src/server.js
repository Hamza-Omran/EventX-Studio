const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const adminAuthRoutes = require("./routes/adminAuth.js");
const eventRoutes = require("./routes/eventRoutes.js");
const bookingAndTicketRoutes = require("./routes/bookingAndTicketRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const adminListRoutes = require("./routes/adminListRoutes.js");
const dashboardStatsRoutes = require("./routes/dashboardStatsRoutes.js");
const optimizedRoutes = require("./routes/optimizedRoutes.js");

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://event-x-studio-alpha.vercel.app",
            "https://event-x-studio-slg5.vercel.app"
        ];

        // Check if origin matches allowed list or is a vercel.app subdomain
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Note: Images are now stored in Cloudinary (URLs stored in database)

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
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "not configured"
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
