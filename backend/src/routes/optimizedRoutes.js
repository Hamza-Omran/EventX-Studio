const express = require("express");
const router = express.Router();
const { protectAny, protectAdmin } = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Message = require("../models/Message");

router.get("/events/list", protectAny, async (req, res) => {
    try {
        const events = await Event.find({}, {
            seatAllocation: 0
        }).populate("createdBy", "name email role");
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/events/details/:id", protectAny, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "name email role");
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/admin/dashboard-data", protectAdmin, async (req, res) => {
    try {
        const [eventsWithoutSeats, users, tickets] = await Promise.all([
            Event.find({}, { seatAllocation: 0, createdBy: 0 }),
            User.find({}, "_id name email image"),
            Ticket.find({}).populate("user", "name").populate("event", "name")
        ]);

        const messages = await Message.find({ to: req.user._id }).sort({ createdAt: -1 }).limit(8);
        const Admin = require("../models/Admin");
        const notifications = await Promise.all(messages.map(async msg => {
            let fromObj = await User.findById(msg.from, "name");
            if (!fromObj) fromObj = await Admin.findById(msg.from, "name");
            return {
                _id: msg._id,
                from: fromObj ? fromObj.name : "Unknown",
                msg: msg.msg,
                createdAt: msg.createdAt
            };
        }));

        const now = new Date();
        const upcomingEvents = eventsWithoutSeats
            .filter(e => e.status === "Up-Coming" && new Date(e.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const finishedEvents = eventsWithoutSeats
            .filter(e => e.status === "Closed" || new Date(e.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let lastFinishedWithSeats = null;
        if (finishedEvents.length > 0) {
            lastFinishedWithSeats = await Event.findById(finishedEvents[0]._id, { createdBy: 0 });
        }

        const ticketStats = {
            totalTickets: tickets.length,
            ticketsByEvent: tickets.reduce((acc, ticket) => {
                if (ticket.event && ticket.event.name) {
                    acc[ticket.event.name] = (acc[ticket.event.name] || 0) + 1;
                }
                return acc;
            }, {})
        };

        res.json({
            events: eventsWithoutSeats,
            users,
            ticketStats,
            upcomingEvents: upcomingEvents.slice(0, 5),
            lastFinished: lastFinishedWithSeats,
            notifications: notifications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/people/list", protectAdmin, async (req, res) => {
    try {
        const [users, admins] = await Promise.all([
            User.find({}, "_id name email image"),
            Admin.find({}, "_id name email image")
        ]);

        res.json({
            users,
            admins,
            currentUser: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                image: req.user.image || ""
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/tickets/management", protectAdmin, async (req, res) => {
    try {
        const [tickets, events, users] = await Promise.all([
            Ticket.find({})
                .populate("user", "_id name email")
                .populate("event", "_id name date venue"),
            Event.find({}, { seatAllocation: 0, description: 0 }),
            User.find({}, "_id name email")
        ]);

        res.json({
            tickets,
            events,
            users,
            currentAdmin: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/analytics/raw-data", protectAdmin, async (req, res) => {
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

router.get("/analytics/event-raw/:id", protectAdmin, async (req, res) => {
    try {
        const [event, tickets] = await Promise.all([
            Event.findById(req.params.id),
            Ticket.find({ event: req.params.id }).populate("user", "name email age gender location interests")
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

router.get("/tickets/my-optimized", protectAny, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id })
            .populate("event", "name date venue ticketPrice");
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
