const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protectAdmin, protectAny } = require("../middleware/authMiddleware");

router.post("/", protectAdmin, createEvent);
router.get("/", protectAny, getEvents);
router.get("/:id", protectAny, getEventById);
router.put("/:id", protectAdmin, updateEvent);
router.delete("/:id", protectAdmin, deleteEvent);

module.exports = router;
