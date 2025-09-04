const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        venue: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        ticketPrice: { type: Number, required: true },
        seatAmount: { type: Number, required: true },
        availableSeats: { type: Number, required: true },
        popularity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
        seatAllocation: [
        {
            seatNumber: String,
            status: { type: String, enum: ["Paid", "Reserved", "Available"], default: "Available" },
            _id: false
        },
        ],
        tags: [{ type: String }],
        expectedAttendance: { type: Number },
        qrCode: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["Up-Coming", "Pending", "Closed"],
            default: "Up-Coming"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
