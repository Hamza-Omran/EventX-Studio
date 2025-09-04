const express = require("express");
const router = express.Router();
const { protectAny, protectAdmin } = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const Message = require("../models/Message");
const User = require("../models/User");
const Admin = require("../models/Admin");

router.get("/dashboard-stats", protectAdmin, async (req, res) => {
    try {
        const [events, tickets, messages] = await Promise.all([
            Event.find({}, { seatAllocation: 0 }),
            Ticket.find({}).populate("event", "name ticketPrice"),
            Message.find({ to: req.user._id }).sort({ createdAt: -1 }).limit(10)
        ]);

        const now = new Date();
        const upcomingEvents = events
            .filter(e => e.status === "Up-Coming" && new Date(e.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        const finishedEvents = events
            .filter(e => e.status === "Closed" || new Date(e.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const populatedMessages = await Promise.all(messages.map(async msg => {
            let fromObj = await User.findById(msg.from, "name");
            if (!fromObj) fromObj = await Admin.findById(msg.from, "name");
            return {
                _id: msg._id,
                from: fromObj ? fromObj.name : "Unknown",
                msg: msg.msg,
                createdAt: msg.createdAt
            };
        }));

        res.json({
            events,
            tickets,
            upcomingEvents,
            lastFinished: finishedEvents[0] || null,
            notifications: populatedMessages
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
