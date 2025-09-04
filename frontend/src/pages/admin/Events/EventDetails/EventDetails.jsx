import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTag, FaUsers, FaChair, FaStar, FaTicketAlt } from "react-icons/fa";
import api from "@/api/axiosInstance";
import SeatAllocation from "@/components/SeatAllocation/SeatAllocation";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import "./EventDetails.css";

const EventDetails = () => {
    const { id } = useParams();
    const outletContext = useOutletContext();
    const { userInfo } = outletContext || {};
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userRole = userInfo?.role;
    const userId = userInfo?._id;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.response?.data?.message || 'Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    const formatTime12 = (timeStr) => {
        if (!timeStr) return "";
        const parts = timeStr.split("-").map(s => s.trim());
        const to12 = t => {
            if (!t) return "";
            let [h, m] = t.split(":");
            h = parseInt(h, 10);
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            return m ? `${h}:${m} ${ampm}` : `${h} ${ampm}`;
        };
        return parts.length === 2 ? `${to12(parts[0])} - ${to12(parts[1])}` : timeStr;
    };

    const handleBookTicket = async () => {
        try {
            const res = await api.post(`/events/${event._id}/book`);
            alert(res.data.message);
            navigate("/dashboard/events");
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    if (loading) return <LoadingDots />;

    if (error) {
        return (
            <div className="event-details-page">
                <button className="event-details-back" onClick={() => navigate(-1)} style={{ background: '#00c896', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: '#fff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="error-message" style={{ textAlign: 'center', color: '#e74c3c', marginTop: '50px' }}>
                    <h3>Error Loading Event</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} style={{ background: '#00c896', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-details-page">
                <button className="event-details-back" onClick={() => navigate(-1)} style={{ background: '#00c896', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: '#fff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                    <h3>Event Not Found</h3>
                    <p>The event you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="event-details-page">
            <button className="event-details-back" onClick={() => navigate(-1)} style={{ background: '#00c896', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: '#fff' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <h2 className="event-details-title">Event Details</h2>
            <div className="event-details-form">
                {}
                <div className="event-details-row three-to-one">
                    <div className="event-details-field">
                        <label>Event Name</label>
                        <div><FaTag /> {event.name}</div>
                    </div>
                    <div className="event-details-field">
                        <label>Event Date</label>
                        <div><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</div>
                    </div>
                </div>

                {}
                <div className="event-details-row three-to-one">
                    <div className="event-details-field">
                        <label>Event Venue</label>
                        <div><FaMapMarkerAlt /> {event.venue}</div>
                    </div>
                    <div className="event-details-field">
                        <label>Event Time</label>
                        <div>{formatTime12(event.time)}</div>
                    </div>
                </div>

                {}
                <div className="event-details-field event-details-description">
                    <label>Event Description</label>
                    <div>{event.description}</div>
                </div>

                {}
                <div className="event-details-row">
                    <div className="event-details-field">
                        <label>Ticket Price</label>
                        <div><FaTicketAlt /> {event.ticketPrice} LKR</div>
                    </div>
                    <div className="event-details-field">
                        <label>Seat Amount</label>
                        <div><FaChair /> {event.seatAmount}</div>
                    </div>
                    <div className="event-details-field">
                        <label>Available Seats</label>
                        <div><FaUsers /> {event.availableSeats}</div>
                    </div>
                    <div className="event-details-field">
                        <label>Popularity</label>
                        <div><FaStar /> {event.popularity}</div>
                    </div>
                </div>

                {}
                <div className="event-details-row">
                    <div className="event-details-seat-section">
                        <SeatAllocation seats={event.seatAllocation} onChange={null} />
                    </div>
                    <div className="event-details-side-fields">
                        <div className="event-details-field next-seats">
                            <label>Tags</label>
                            <div>{event.tags && event.tags.join(", ")}</div>
                        </div>
                        <div className="event-details-field">
                            <label>Expected Attendance</label>
                            <div>{event.expectedAttendance}</div>
                        </div>

                        {userRole === "user" && (
                            <button
                                className="event-details-book-btn"
                                style={{ float: 'right' }}
                                disabled={event.attendees && userId && event.attendees.includes(userId)}
                                onClick={handleBookTicket}
                            >Book Ticket</button>
                        )}

                        <div className="event-details-actions" style={userRole === "admin" ? {} : { display: "none" }}>
                            {userRole === "admin" && (
                                <>
                                    <button className="event-details-edit-btn" onClick={() => navigate(`/dashboard/events/edit-event/${event._id}`)}>Edit</button>
                                    <button className="event-details-insights-btn" onClick={() => navigate(`/dashboard/events/insights/${event._id}`)}>Attendee Insights</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
