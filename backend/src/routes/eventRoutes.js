const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protectAdmin, protectAny, admin } = require("../middleware/authMiddleware");

router.post("/", protectAdmin, admin, createEvent);
router.get("/", protectAny, getEvents);
router.get("/:id", protectAny, getEventById);
router.put("/:id", protectAdmin, admin, updateEvent);
router.delete("/:id", protectAdmin, admin, deleteEvent);

module.exports = router;
