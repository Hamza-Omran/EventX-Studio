import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import TicketCard from "@/components/TicketCard";
import LoadingDots from "@/components/LoadingDots/LoadingDots";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/tickets/my")
            .then(res => setTickets(res.data))
            .catch(() => setError("Failed to load tickets."))
            .finally(() => setLoading(false));
    }, []);

    const handleCheckIn = async (ticketId) => {
        alert("Check-in validation for ticket " + ticketId);
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "32px 32px 32px 90px" }}>
            <h2>My Tickets</h2>
            {tickets.length === 0 ? (
                <div>No tickets found.</div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                    {tickets.map(ticket => (
                        <TicketCard key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
