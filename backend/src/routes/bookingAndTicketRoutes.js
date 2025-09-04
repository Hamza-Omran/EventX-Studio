const express = require("express");
const router = express.Router();
const { protectAny, protectAdmin } = require("../middleware/authMiddleware");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const QRCode = require("qrcode");

router.post("/events/:id/book", protectAny, async (req, res) => {
    const ObjectId = require('mongoose').Types.ObjectId;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        const alreadyBooked = await Ticket.findOne({ user: req.user._id, event: event._id });
        if (alreadyBooked) return res.status(400).json({ message: "You have already booked this event." });
        if (event.availableSeats <= 0) return res.status(400).json({ message: "No seats available" });
        
        // Update only the availableSeats field to avoid validation issues
        await Event.findByIdAndUpdate(req.params.id, { 
            $inc: { availableSeats: -1 }
        });
        
        const tempTicketId = new ObjectId();
        const qrData = `http://localhost:5173/dashboard/tickets/details/${tempTicketId}`;
        const qrCode = await QRCode.toDataURL(qrData);
        const ticket = await Ticket.create({ _id: tempTicketId, user: req.user._id, event: event._id, qrCode, status: "Valid" });
        res.json({ message: "Ticket booked successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/bookings/event/:id", protectAny, async (req, res) => {
    try {
        const tickets = await Ticket.find({ event: req.params.id }).populate("user", "name email");
        const bookings = tickets.map(ticket => ({
            _id: ticket._id,
            user: ticket.user,
            event: ticket.event,
            status: ticket.status === "Valid" ? "Booked" : ticket.status,
            timestamp: ticket.timestamp
        }));
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/bookings/user/:id", protectAny, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.params.id }).populate("event", "name date");
        const bookings = tickets.map(ticket => ({
            _id: ticket._id,
            user: ticket.user,
            event: ticket.event,
            status: ticket.status === "Valid" ? "Booked" : ticket.status,
            timestamp: ticket.timestamp
        }));
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/tickets/all", protectAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate("user", "_id name email")
            .populate("event", "_id name date venue");
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/tickets/my", protectAny, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id }).populate("event", "name date venue");
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/tickets/:ticketId", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId)
            .populate("user", "name email")
            .populate("event", "name date venue");
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/tickets", protectAdmin, async (req, res) => {
    const QRCode = require("qrcode");
    const mongoose = require("mongoose");
    try {
        const { user, event, status, timestamp } = req.body;
        if (!user || !event) {
            return res.status(400).json({ message: "user and event are required" });
        }
        const tempTicketId = new mongoose.Types.ObjectId();
        const qrData = `http://localhost:5173/dashboard/tickets/details/${tempTicketId}`;
        const qrCode = await QRCode.toDataURL(qrData);
        const ticket = await Ticket.create({ _id: tempTicketId, user, event, qrCode, status, timestamp });
        res.status(201).json({ message: "Ticket created successfully", ticket });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
