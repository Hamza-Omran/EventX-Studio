import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import EventInsights from "../Events/EventInsights/EventInsights";
import "./AnalyticsReports.css";

const AnalyticsReports = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [appliedEventId, setAppliedEventId] = useState("");
    useEffect(() => {
        api.get("/events").then(res => setEvents(res.data));
    }, []);
    const handleApply = () => {
        setAppliedEventId(selectedEvent);
    };
    return (
        <div className="analytics-reports-root">
            <div className="analytics-reports-header">
                <select
                    className="analytics-reports-dropdown"
                    value={selectedEvent}
                    onChange={e => setSelectedEvent(e.target.value)}
                >
                    <option value="">Select Event</option>
                    {events.map(ev => (
                        <option key={ev._id} value={ev._id}>{ev.name}</option>
                    ))}
                </select>
                <button className="analytics-reports-apply-btn" onClick={handleApply} disabled={!selectedEvent}>Apply</button>
            </div>
            <div className="analytics-reports-content">
                {appliedEventId && <EventInsights eventId={appliedEventId} />}
            </div>
        </div>
    );
};

export default AnalyticsReports;
