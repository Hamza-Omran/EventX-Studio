const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
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

app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", bookingAndTicketRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", messageRoutes);
app.use("/api", adminListRoutes);
app.use("/api", dashboardStatsRoutes);
app.use("/api/optimized", optimizedRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n\nServer running on port ${PORT}\n\n`);
});
