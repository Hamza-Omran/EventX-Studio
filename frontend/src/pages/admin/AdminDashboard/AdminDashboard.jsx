import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import StatCard from "@/components/Analytics/StatCard";
import { FaUsers, FaFileInvoice, FaMoneyBillWave } from "react-icons/fa";
import api from "@/api/axiosInstance";
import SeatAllocation from "@/components/SeatAllocation/SeatAllocation";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import { Pie, Line } from "react-chartjs-2";
import { calculateDashboardStats } from "@/utils/calculationUtils";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
} from "chart.js";
import "./adminDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
    const { userInfo } = useOutletContext();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [stats, setStats] = useState(null);
    const [showSalesDetails, setShowSalesDetails] = useState(true);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dashboardRes = await api.get("/optimized/admin/dashboard-data");
                const data = dashboardRes.data;
                setDashboardData(data);

                const calculatedStats = calculateDashboardStats(data.events, data.ticketStats);
                setStats(calculatedStats);
            } catch (err) {
                console.error("Error loading optimized dashboard:", err);
                try {
                    const [statsRes, usersRes, eventsRes] = await Promise.all([
                        api.get("/dashboard-stats"),
                        api.get("/users"),
                        api.get("/events")
                    ]);

                    setStats(statsRes.data);
                    setDashboardData({
                        users: usersRes.data,
                        events: eventsRes.data,
                        upcomingEvents: statsRes.data.upcomingEvents || [],
                        lastFinished: statsRes.data.lastFinished,
                        notifications: statsRes.data.notifications || []
                    });
                } catch (fallbackErr) {
                    console.error("Error with fallback dashboard:", fallbackErr);
                }
            }
        };

        loadDashboard();
    }, []);

    useEffect(() => {
        if (!search || !dashboardData) {
            setSearchResults([]);
            return;
        }
        const userMatches = dashboardData.users
            .filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
            .map(u => ({ type: "user", label: u.email, id: u._id }));
        const eventMatches = dashboardData.events
            .filter(ev => ev.name.toLowerCase().includes(search.toLowerCase()))
            .map(ev => ({ type: "event", label: ev.name, id: ev._id }));
        setSearchResults([...userMatches, ...eventMatches]);
    }, [search, dashboardData]);

    const handleSettings = async () => {
        try {
            if (userInfo) {
                navigate(`/dashboard/manage-people/edit/${userInfo.role}/${userInfo._id}`, { state: { person: userInfo, type: userInfo.role } });
            } else {
                console.error("User info not available");
                alert("User information is not loaded yet. Please try again.");
            }
        } catch (err) {
            console.error("Error navigating to settings:", err);
            alert("Failed to load your profile");
        }
    };

    if (!stats || !dashboardData) return <LoadingDots />;

    const lineChartData = {
        labels: stats.revenueDayArr.map(d => d.day),
        datasets: [
            {
                label: "Revenue",
                data: stats.revenueDayArr.map(d => d.revenue),
                fill: false,
                borderColor: "#e74c3c",
                backgroundColor: "#e74c3c",
                tension: 0.3,
                pointRadius: 4,
            },
        ],
    };
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Day",
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    }
                },
                ticks: {
                    color: "#222",
                    font: {
                        size: window.innerWidth < 768 ? 9 : 11
                    }
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Revenue",
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    }
                },
                ticks: {
                    color: "#222",
                    font: {
                        size: window.innerWidth < 768 ? 9 : 11
                    }
                },
            },
        },
    };

    const donutData = {
        labels: stats.engagementArr.map(e => e.event),
        datasets: [
            {
                data: stats.engagementArr.map(e => e.count),
                backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6", "#00c896"],
                borderWidth: 2,
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: window.innerWidth < 768 ? 'bottom' : 'right',
                labels: {
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    },
                    padding: window.innerWidth < 768 ? 10 : 15
                }
            }
        }
    };

    return (
        <div className="admin-dashboard-root">
            <div className="admin-dashboard-header">
                <div className="left-wing">
                    <div className="admin-dashboard-avatar">
                        {userInfo?.image ? (
                            <img
                                src={`http://localhost:5000/${userInfo.image}`}
                                alt={`${userInfo.name}'s profile`}
                            />
                        ) : (
                            <svg width="35" height="35" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <div className="admin-dashboard-welcome">Welcome {userInfo?.name}</div>
                        <div className="admin-dashboard-role">System Administrator</div>
                    </div>
                </div>
                <div className="admin-dashboard-search">
                    <input
                        placeholder="Search ..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && searchResults.length > 0 && (
                        <div className="admin-dashboard-search-dropdown">
                            {searchResults.map((item) => (
                                <div
                                    key={item.id + item.type}
                                    className="admin-dashboard-search-item"
                                    onClick={() => {
                                        if (item.type === 'user') {
                                            navigate(`/dashboard/manage-people?userSearch=${encodeURIComponent(item.label)}`);
                                        } else {
                                            navigate(`/dashboard/events?search=${encodeURIComponent(item.label)}`);
                                        }
                                    }}
                                >
                                    {item.type === 'user' ? `User: ${item.label}` : `Event: ${item.label}`}
                                </div>
                            ))}
                        </div>
                    )}
                    <span className="admin-dashboard-icon" onClick={() => window.location.href = '/dashboard/notifications'}>🔔</span>
                    <span className="admin-dashboard-icon" onClick={handleSettings}>⚙️</span>
                </div>
            </div>
            <div className="admin-dashboard-main-grid">
                <div className="admin-dashboard-main-left">
                    <div className="Charts-and-cards">
                        <div className="admin-dashboard-stats-row">
                            <StatCard title="EVENTS" value={`${stats.numEvents} Events`} icon={<FaUsers className="admin-dashboard-stat-icon events" />} />
                            <StatCard title="BOOKINGS" value={stats.numBookings} icon={<FaFileInvoice className="admin-dashboard-stat-icon bookings" />} />
                            <StatCard title="REVENUE" value={<span className="revenue-value">{stats.revenue} LKR</span>} icon={<FaMoneyBillWave className="admin-dashboard-stat-icon revenue" />} />
                        </div>
                        <div className="charts">
                            <div className="admin-dashboard-card admin-dashboard-sales">
                                <div className="header">
                                    <div className="admin-dashboard-card-title clickable">
                                        NET SALES
                                        <span
                                            className={`dropdown-arrow ${showSalesDetails ? 'expanded' : 'collapsed'}`}
                                            onClick={() => setShowSalesDetails(v => !v)}
                                        >
                                            ▼
                                        </span>
                                    </div>
                                    <div className="admin-dashboard-sales-row" style={{
                                        maxHeight: showSalesDetails ? 200 : 0,
                                        opacity: showSalesDetails ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                                    }}>
                                        <div>Total Revenue <br /> <span className="revenue-stat">{stats.revenue} LKR</span></div>
                                        <div>Total Tickets <br /> <span className="tickets-stat">{stats.totalTickets} Tickets</span></div>
                                        <div>Total Events <br /> <span className="events-stat">{stats.numEvents} Events</span></div>
                                    </div>

                                </div>
                                <div className="admin-dashboard-sales-chart">
                                    <div>
                                        <Line data={lineChartData} options={lineChartOptions} />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-dashboard-card admin-dashboard-engagement chart">
                                <div className="admin-dashboard-card-title">Customer Engagement</div>
                                <div className="admin-dashboard-engagement-chart">
                                    <div className="chart-container">
                                        <Pie data={donutData} options={{
                                            cutout: "60%",
                                            ...donutOptions
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="admin-dashboard-card admin-dashboard-latest-event">
                        <div className="admin-dashboard-card-title">Latest Event</div>
                        {dashboardData.lastFinished ? (
                            <>
                                <div>Event Name: <b>{dashboardData.lastFinished.name}</b></div>
                                <div className="event-date">Event Date: <b>{new Date(dashboardData.lastFinished.date).toLocaleDateString()}</b></div>
                                <SeatAllocation seats={dashboardData.lastFinished.seatAllocation || []} />
                            </>
                        ) : <div>No finished events yet.</div>}
                    </div>
                </div>
                <div className="admin-dashboard-main-right">
                    <div className="admin-dashboard-card admin-dashboard-upcoming upcoming-events">
                        <div className="admin-dashboard-card-title">Upcoming Events</div>
                        <div className="admin-dashboard-upcoming-list scrollable">
                            {dashboardData.upcomingEvents?.map((ev, i) => (
                                <div key={i} className="admin-dashboard-upcoming-item">
                                    <div>
                                        <div className="admin-dashboard-upcoming-name">Event : {ev.name}</div>
                                        <div className="admin-dashboard-upcoming-date">Date : {new Date(ev.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            )) || <div>No upcoming events</div>}
                            <div className="admin-dashboard-upcoming-seeall" onClick={() => window.location.href = '/dashboard/events'}>See All</div>
                        </div>
                    </div>
                    <div className="admin-dashboard-card admin-dashboard-notifications notifications-card">
                        <div className="admin-dashboard-card-title">Notifications</div>
                        <div className="admin-dashboard-notifications-list scrollable">
                            {dashboardData.notifications?.map((note, i) => (
                                <div key={i} className="admin-dashboard-notification-item">
                                    <span className="admin-dashboard-notification-icon">💬</span>
                                    <span>{note.msg}</span>
                                </div>
                            )) || <div>No notifications</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
