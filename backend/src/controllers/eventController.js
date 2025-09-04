const Event = require("../models/Event");

function getEventStatus(event) {
    if (event.status === "Pending") return "Pending";
    const today = new Date();
    const eventDate = new Date(event.date);
    if (eventDate < today) return "Closed";
    return "Up-Coming";
}

const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.user._id };
    eventData.status = getEventStatus(eventData);
    const event = new Event(eventData);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}, {
      seatAllocation: 0
    }).populate("createdBy", "name email role");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email role");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.status !== "Pending") {
      updateData.status = getEventStatus(updateData);
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
