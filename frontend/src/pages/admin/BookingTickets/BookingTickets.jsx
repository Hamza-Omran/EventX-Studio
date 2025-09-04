import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import TicketCard from "@/components/TicketCard";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import "./BookingTickets.css";

const BookingTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await api.get("/optimized/tickets/management");
                setTickets(res.data.tickets);
                setEvents(res.data.events);
                setUsers(res.data.users);

            } catch (err) {
                console.error("Error fetching optimized ticket data:", err);

                try {
                    const [ticketsRes, eventsRes, usersRes] = await Promise.all([
                        api.get("/tickets/all"),
                        api.get("/events"),
                        api.get("/users")
                    ]);
                    setTickets(ticketsRes.data);
                    setEvents(eventsRes.data);
                    setUsers(usersRes.data);

                } catch (fallbackErr) {
                    console.error("Error with fallback ticket data:", fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const matchesEmail = search ? (ticket.user?.email || "").toLowerCase().includes(search.toLowerCase()) : true;
        const matchesEvent = selectedEvent ? ticket.event?._id === selectedEvent : true;
        return matchesEmail && matchesEvent;
    });

    const userObj = users.find(u => (u.email || "").toLowerCase() === search.toLowerCase()) || null;

    const eventObj = events.find(ev => ev._id === selectedEvent) || null;

    const ticketExists = tickets.some(t => (t.user?.email || "").toLowerCase() === search.toLowerCase() && t.event?._id === selectedEvent);

    const showAddButton = userObj && eventObj && !ticketExists;

    const handleAddTicket = async () => {
        setAddLoading(true);
        try {

            const ticketParams = {
                user: userObj._id,
                event: eventObj._id,
                status: "Valid",
                timestamp: new Date().toISOString(),
                booking: null
            };
            await api.post("/tickets", ticketParams);
            alert("Ticket created for user " + userObj.email + " in event " + eventObj.name);
            api.get("/tickets/all").then(res => setTickets(res.data));
        } catch (err) {
            alert("Failed to create ticket: " + (err.response?.data?.message || err.message));
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <div className="booking-tickets-root">
            <h2 style={{marginBottom: "20px"}}>Booking & Tickets</h2>
            <div className="booking-tickets-filters">
                <input
                    type="text"
                    placeholder="Search by user email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="booking-tickets-search"
                />
                <select
                    value={selectedEvent}
                    onChange={e => setSelectedEvent(e.target.value)}
                    className="booking-tickets-dropdown"
                >
                    <option value="">All Events</option>
                    {events.map(ev => (
                        <option key={ev._id} value={ev._id}>{ev.name}</option>
                    ))}
                </select>
                {showAddButton && (
                    <button
                        style={{ marginLeft: "auto", background: "#00c896", color: "#fff", borderRadius: 12, padding: "8px 24px", fontWeight: 600, border: "none", cursor: "pointer" }}
                        onClick={handleAddTicket}
                        disabled={addLoading}
                    >
                        {addLoading ? "Adding..." : "Add"}
                    </button>
                )}
            </div>
            {loading ? (
                <LoadingDots />
            ) : (
                <div className="booking-tickets-list">
                    {filteredTickets.length === 0 ? (
                        <div>No tickets found.</div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} showUser={true} showBooking={true} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingTickets;
