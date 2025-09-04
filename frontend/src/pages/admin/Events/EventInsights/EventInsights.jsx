import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "@/components/Analytics/DataTable";
import api from "@/api/axiosInstance";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { calculateEventInsights } from "@/utils/calculationUtils";
import './EventInsights.css';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const pieColors = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#ffb300", "#6d28d9", "#a78bfa", "#e6fff7"];

const EventInsights = ({ eventId: propEventId }) => {
    const params = useParams();
    const eventId = propEventId || params.eventId;
    const [stats, setStats] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    useEffect(() => {
        if (!eventId) return;
        const fetchEventInsights = async () => {
            try {
                const [rawDataRes, eventRes] = await Promise.all([
                    api.get(`/optimized/analytics/event-raw/${eventId}`),
                    api.get(`/events/${eventId}`)
                ]);
                const calculatedStats = calculateEventInsights(rawDataRes.data);
                setStats(calculatedStats);
                setEventDetails(eventRes.data);
            } catch (err) {
                console.error("Error fetching optimized event insights:", err);
                api.get(`/analytics/event/${eventId}`).then(res => setStats(res.data));
                api.get(`/events/${eventId}`).then(res => setEventDetails(res.data));
            }
        };

        fetchEventInsights();
    }, [eventId]);
    if (!eventId) return null;
    if (!stats || !eventDetails) return <LoadingDots />;
    if (
        Object.keys(stats.attendeeLocations || {}).length === 0 &&
        Object.keys(stats.ageGroups || {}).length === 0 &&
        Object.keys(stats.interests || {}).length === 0
    ) {
        return (
            <div className="event-insights-empty-wrapper">
                <div className="event-insights-empty-message">
                    No attendee insights available for this event.<br />
                    Please check back later or add some attendees.
                </div>
            </div>
        );
    }
    const ageBarData = {
        labels: Object.keys(stats.ageGroups),
        datasets: [{
            label: "Attendees",
            data: Object.values(stats.ageGroups),
            backgroundColor: pieColors.slice(0, Object.keys(stats.ageGroups).length),
            barPercentage: 0.4,
            categoryPercentage: 0.6,
        }],
    };
    const locationBarData = {
        labels: Object.keys(stats.attendeeLocations),
        datasets: [{
            label: "Attendees",
            data: Object.values(stats.attendeeLocations),
            backgroundColor: pieColors.slice(0, Object.keys(stats.attendeeLocations).length),
            barPercentage: 0.4,
            categoryPercentage: 0.6,
        }],
    };
    const interestsPieData = {
        labels: Object.keys(stats.interests),
        datasets: [{
            data: Object.values(stats.interests),
            backgroundColor: pieColors.slice(0, Object.keys(stats.interests).length),
        }],
    };

    return (
        <div className="event-insights-root">
            <div className="event-insights-header-row">
                <button className="event-insights-back-btn" onClick={() => window.history.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div>
                    <h2 className="event-insights-title">Attendee Insights - {eventDetails.name}</h2>
                    <div className="event-insights-meta">
                        <div>Event Venue : {eventDetails.venue}</div>
                        <div>Event Date : {new Date(eventDetails.date).toLocaleDateString()}</div>
                        <div>Event Time : {eventDetails.time}</div>
                    </div>
                </div>
            </div>
            <div className="event-insights-main-grid">
                <div className="event-insights-charts-col">
                    <div className="event-insights-card">
                        <div className="event-insights-card-title">ATTENDEE AGE GROUPS</div>
                        <div className="event-chart">
                            <div className="event-insights-bar-chart">
                                <Bar data={ageBarData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { autoSkip: false } } } }} />
                            </div>
                            <div className="event-insights-legend-col event-insights-legend-below">
                                {Object.entries(stats.ageGroups).map(([group, count], idx) => (
                                    <div key={group} className="event-insights-legend-item">
                                        <span className="event-insights-legend-dot" style={{ background: pieColors[idx % pieColors.length] }}></span>
                                        <span className="event-insights-legend-label">{group}</span>
                                        <span className="event-insights-legend-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="event-insights-table-col">
                        <div className="event-insights-card">
                            <DataTable title="Attendee Locations" data={stats.attendeeLocations} />
                        </div>
                    </div>
                </div>
                <div className="event-insights-charts-row">
                    <div className="event-insights-card event-insights-pie-card">
                        <div className="event-insights-card-title">ATTENDEE INTERESTS</div>
                        <div className="event-chart">
                            <div className="event-insights-pie-chart">
                                <Pie data={interestsPieData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} />
                            </div>
                            <div className="event-insights-legend-col event-insights-legend-left">
                                {Object.entries(stats.interests).map(([interest, count], idx) => (
                                    <div key={interest} className="event-insights-legend-item">
                                        <span className="event-insights-legend-dot" style={{ background: pieColors[idx % pieColors.length] }}></span>
                                        <span className="event-insights-legend-label">{interest}</span>
                                        <span className="event-insights-legend-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="event-insights-card event-insights-bar-card">
                        <div className="event-insights-card-title">ATTENDEE LOCATIONS</div>
                        <div className="event-chart">
                            <div className="event-insights-bar-chart second-bar">
                                <Bar data={locationBarData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { autoSkip: false } } } }} />
                            </div>
                            <div className="event-insights-legend-col event-insights-legend-below">
                                {Object.entries(stats.attendeeLocations).map(([loc, count], idx) => (
                                    <div key={loc} className="event-insights-legend-item">
                                        <span className="event-insights-legend-dot" style={{ background: pieColors[idx % pieColors.length] }}></span>
                                        <span className="event-insights-legend-label">{loc}</span>
                                        <span className="event-insights-legend-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventInsights;
