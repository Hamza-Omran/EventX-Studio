import React from "react";
import "./TicketCard.css";

const TicketCard = ({ ticket, showUser, showBooking }) => (
    <div className="ticket-card">
        {showUser && <div><b>User:</b> {ticket.user?.name} ({ticket.user?.email})</div>}
        <h3>{ticket.event?.name}</h3>
        <div>Date: {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : ""}</div>
        <div>Venue: {ticket.event?.venue}</div>
        <div>Status: {ticket.status}</div>
        {showBooking && <div><b>Booking ID:</b> {ticket.booking}</div>}
        <img src={ticket.qrCode} alt="QR Code" className="ticket-card-qr" />
    </div>
);

export default TicketCard;
