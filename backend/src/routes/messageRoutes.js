const express = require("express");
const router = express.Router();
const { protectAny } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/user");

router.get("/users", protectAny, async (req, res) => {
    try {
        const users = await User.find({}, "_id name email");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/messages/received", protectAny, async (req, res) => {
    try {
        const messages = await Message.find({ to: req.user._id }).sort({ createdAt: -1 });
        const Admin = require("../models/Admin");
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
        res.json(populatedMessages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/messages/:userId", protectAny, async (req, res) => {
    if (req.params.userId === "received") return res.status(404).json({ message: "Not found" });
    try {
        const myId = req.user._id;
        const otherId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { from: myId, to: otherId },
                { from: otherId, to: myId }
            ]
        }).sort({ createdAt: 1 });
        const simpleMessages = messages.map(msg => ({
            _id: msg._id,
            from: msg.from,
            to: msg.to,
            msg: msg.msg,
            createdAt: msg.createdAt,
            __v: msg.__v
        }));
        res.json(simpleMessages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/messages", protectAny, async (req, res) => {
    try {
        const { to, msg } = req.body;
        const from = req.user._id;
        const fromModel = req.user.role === "admin" ? "Admin" : "User";
        let toModel = "User";
        const Admin = require("../models/Admin");
        const isAdmin = await Admin.findById(to);
        if (isAdmin) toModel = "Admin";
        const message = await Message.create({ from, fromModel, to, toModel, msg });
        const populatedMsg = await Message.findById(message._id)
            .populate({ path: "from", model: fromModel, select: "name email" })
            .populate({ path: "to", model: toModel, select: "name email" });
        res.status(201).json(populatedMsg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
