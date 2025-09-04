import React, { useState } from "react";
import "./SeatAllocation.css";

const ROW_LENGTH = 10;
const normalizeSeats = (seats) => {
    if (!Array.isArray(seats)) return [];
    if (Array.isArray(seats[0])) return seats;
    const rows = [];
    for (let i = 0; i < seats.length; i += ROW_LENGTH) {
        rows.push(seats.slice(i, i + ROW_LENGTH));
    }
    return rows;
};

const SeatAllocation = ({ seats, onChange }) => {
    const normalizedSeats = normalizeSeats(seats);
    const [popup, setPopup] = useState({ open: false, row: null, col: null, x: 0, y: 0 });

    const handleSeatClick = (rowIdx, colIdx, e) => {
        if (!onChange) return;
        const seat = normalizedSeats[rowIdx][colIdx];
        if (!seat || seat.status !== "Available") return;
        const rect = e.target.getBoundingClientRect();
        setPopup({ open: true, row: rowIdx, col: colIdx, x: rect.left + rect.width / 2, y: rect.top + rect.height });
    };

    const handleOption = (status) => {
        if (!onChange || popup.row === null || popup.col === null) return;
        const newSeats = normalizedSeats.map((row, i) =>
            row.map((seat, j) => {
                if (i === popup.row && j === popup.col) {
                    return { ...seat, status };
                }
                return seat;
            })
        );
        onChange(newSeats);
        setPopup({ open: false, row: null, col: null, x: 0, y: 0 });
    };

    const handleClose = () => setPopup({ open: false, row: null, col: null, x: 0, y: 0 });

    return (
        <div className="event-add-seat-section">
            <h3 className="event-add-seat-title">Seat Allocation</h3>
            <div className="event-add-seat-legend">
                <span className="seat-paid"></span> Paid Seats
                <span className="seat-reserved"></span> Reserved Seats
                <span className="seat-available"></span> Available
            </div>
            <div className="event-add-seat-grid">
                {normalizedSeats.map((row, i) => (
                    <div key={i} className="seat-row">
                        {row.map((seat, j) => (
                            <span
                                key={j}
                                className={`seat-dot seat-${seat && seat.status ? seat.status.toLowerCase() : "null"} ${onChange && seat ? "pointer" : "default"}`}
                                onClick={e => onChange && seat ? handleSeatClick(i, j, e) : undefined}
                            ></span>
                        ))}
                    </div>
                ))}
            </div>
            {popup.open && (
                <div
                    className="seat-popup"
                    style={{ left: popup.x, top: popup.y }}
                >
                    <button className="seat-popup-btn" onClick={() => handleOption("Reserved")}>Reserve</button>
                    <button className="seat-popup-btn" onClick={() => handleOption("Paid")}>Pay</button>
                    <button className="seat-popup-close" onClick={handleClose}>×</button>
                </div>
            )}
        </div>
    );
};

export default SeatAllocation;
