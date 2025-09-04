const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  qrCode: { type: String, required: true },
  status: { type: String, enum: ["Valid", "CheckedIn", "Cancelled"], default: "Valid" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", ticketSchema);
