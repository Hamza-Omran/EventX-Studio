const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/user");

function getAgeGroup(age) {
    if (age >= 18 && age <= 25) return "18-25";
    if (age >= 26 && age <= 35) return "26-35";
    if (age >= 36 && age <= 50) return "36-50";
    return "Other";
}
router.get("/analytics/overall", protectAdmin, async (req, res) => {
    try {
        const [events, users, tickets] = await Promise.all([
            Event.find({}, { seatAllocation: 0 }),
            User.find({}),
            Ticket.find({}).populate("event", "ticketPrice")
        ]);

        res.json({
            events,
            users,
            tickets
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/analytics/event/:id", protectAdmin, async (req, res) => {
    try {
        const eventId = req.params.id;
        const [event, tickets] = await Promise.all([
            Event.findById(eventId),
            Ticket.find({ event: eventId }).populate("user")
        ]);

        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json({
            event,
            tickets,
            attendees: tickets.map(ticket => ticket.user).filter(Boolean)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
