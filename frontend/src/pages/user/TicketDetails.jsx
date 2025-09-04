import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axiosInstance";
import TicketCard from "@/components/TicketCard";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import "./TicketDetails.css";

const TicketDetails = () => {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/tickets/${ticketId}`)
            .then(res => setTicket(res.data))
            .catch(() => setError("Failed to load ticket details."))
            .finally(() => setLoading(false));
    }, [ticketId]);

    if (loading) return <LoadingDots />;
    if (error) return <div className="ticket-details-error">{error}</div>;
    if (!ticket) return <div className="ticket-details-error">Ticket not found.</div>;

    return (
        <div className="ticket-details-container">
            <h2>Ticket Details</h2>
            <TicketCard ticket={ticket} showUser={true} showBooking={true} />
        </div>
    );
};

export default TicketDetails;
