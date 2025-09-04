import React, { useEffect, useRef } from "react";
import {
    FaEdit,
    FaTrash,
    FaInfoCircle,
    FaMoneyBill,
    FaShoppingCart,
    FaTicketAlt,
    FaArrowRight
} from "react-icons/fa";
import "./EventCard.css";
import { useOutletContext } from "react-router-dom";

const EventCard = ({ event, menuOpen, setMenuOpen, confirmDelete, setConfirmDelete, handleDelete, navigate }) => {
    const { userInfo } = useOutletContext();
    const userRole = userInfo?.role;
    const menuRef = useRef();

    const isAdmin = userRole === "admin";

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuOpen === event._id && menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen, event._id, setMenuOpen]);

    return (
        <div className="event-card">
            {}
            <div className="event-card-header">
                <span className="event-icon">🎤</span>
                <span className="event-title">{event.name}</span>
                <span
                    className="event-menu"
                    onClick={() => setMenuOpen(menuOpen === event._id ? null : event._id)}
                >
                    ⋮
                </span>

                {}
                {menuOpen === event._id && (
                    <div className="event-card-menu" ref={menuRef}>
                        {isAdmin && (
                            <>
                                <button className="menu-edit" type="button" onClick={() => navigate(`/dashboard/events/edit-event/${event._id}`)}><FaEdit /> Edit</button>
                                <button className="menu-delete" type="button" onClick={() => setConfirmDelete(event._id)}><FaTrash /> Delete</button>
                            </>
                        )}
                        <button className="menu-details" type="button" onClick={() => navigate(`/dashboard/events/details/${event._id}`)}><FaInfoCircle /> Details</button>
                    </div>
                )}
            </div>

            {}
            <div className="event-card-body">
                <div className="event-prices">
                    <span className="price green">
                        <FaMoneyBill /> {event.ticketPrice} LKR
                    </span>
                    <span className="price red">
                        <FaShoppingCart /> {event.seatAmount - event.availableSeats}
                    </span>
                    <span className="price purple">
                        <FaTicketAlt /> {event.availableSeats}
                    </span>
                </div>
                <hr className="event-card-hr" />
                <div className="event-details">
                    <div><b>Venue:</b> <span className="event-details-value">{event.venue}</span></div>
                    <div><b>Date:</b> <span className="event-details-value">{new Date(event.date).toLocaleDateString()}</span></div>
                    <div><b>Time:</b> <span className="event-details-value">{event.time}</span></div>
                </div>
            </div>

            {}
            <div className="event-card-footer">
                <button className="event-arrow" onClick={() => navigate(`/dashboard/events/details/${event._id}`)}><FaArrowRight /></button>
            </div>

            {}
            {confirmDelete === event._id && (
                <div className="event-card-confirm">
                    <div>Are you sure you want to delete?</div>
                    <div className="event-card-confirm-buttons">
                        <button onClick={() => handleDelete(event._id)}>Yes</button>
                        <button onClick={() => setConfirmDelete(null)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCard;
