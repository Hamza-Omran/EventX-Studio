import { forwardRef } from "react";
import {
    FaTachometerAlt,
    FaCalendarAlt,
    FaTicketAlt,
    FaUsers,
    FaChartBar,
    FaHeadset,
    FaBell,
    FaCog,
    FaBullhorn,
    FaFolderOpen,
    FaUserCog,
    FaSignOutAlt,
    FaBars,
    FaRocket,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../api/axiosInstance';
import './Sidebar.css'

const Sidebar = forwardRef(({ sidebarOpen, setSidebarOpen, toggleOpacity, userInfo }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = userInfo?.role;

    const handleLogout = async () => {
        window.location.href = "/login";
    };

    const handleSettings = () => {
        if (userInfo && userInfo._id && userInfo.role) {
            navigate(`/dashboard/manage-people/edit/${userInfo.role}/${userInfo._id}`, {
                state: { person: userInfo, type: userInfo.role }
            });
            if (window.innerWidth <= 1350) {
                setSidebarOpen(false);
            }
        } else {
            alert("User information not available");
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (window.innerWidth <= 1350) {
            setSidebarOpen(false);
        }
    };

    const handleLogoutClick = () => {
        handleLogout();
        if (window.innerWidth <= 1350) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            <button
                className="sidebar-toggle-left"
                style={{ opacity: sidebarOpen ? 0 : 1 }}
                onClick={() => setSidebarOpen((v) => !v)}
            >
                <FaBars />
            </button>

            <aside ref={ref} className={`sidebar${sidebarOpen ? " open" : ""}`}>
                <button
                    className="sidebar-toggle-fixed"
                    style={{ opacity: toggleOpacity }}
                    onClick={() => setSidebarOpen((v) => !v)}
                >
                    <FaBars />
                </button>

                <div className="sidebar-logo">
                    EventX <span>Studio</span>
                </div>
                {userRole === "admin" && (
                    <button className="sidebar-add-btn" onClick={() => handleNavigate("/dashboard/events/add-event")}>
                        <FaCalendarAlt /> Add Quick Event
                    </button>
                )}
                <nav className="sidebar-nav">
                    {userRole === "user" ? (
                        <>
                            <div className="sidebar-navdiv">Main Navigation</div>
                            <ul className="sidebar-navul">
                                <li className={`sidebar-navli${location.pathname === "/dashboard/events" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/events")}> <span className="sidebar-icon"><FaCalendarAlt /></span> Browse Events </li>
                                <li className={`sidebar-navli${location.pathname === "/dashboard/tickets" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/tickets")}> <span className="sidebar-icon"><FaTicketAlt /></span> Bookings & Tickets </li>
                            </ul>
                            <hr className="sidebar-divider" />
                            <div className="sidebar-navdiv">Support</div>
                            <ul className="sidebar-navul">
                                <li className="sidebar-navli" onClick={() => handleNavigate("/dashboard/messages")}>
                                    <span className="sidebar-icon"><FaHeadset /></span>
                                    Contact Support
                                </li>
                                <li className="sidebar-navli" onClick={() => handleNavigate("/dashboard/notifications")}>
                                    <span className="sidebar-icon"><FaBell /></span>
                                    Notifications
                                </li>
                            </ul>
                            <hr className="sidebar-divider" />
                            <div className="sidebar-navdiv">Account Management</div>
                            <ul className="sidebar-navul">
                                <li className="sidebar-navli" onClick={handleSettings}>
                                    <span className="sidebar-icon"><FaCog /></span>
                                    Settings
                                </li>
                                <li className="sidebar-navli" onClick={handleLogoutClick}>
                                    <span className="sidebar-icon"><FaSignOutAlt /></span>
                                    Logout
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <div className="sidebar-navdiv">Main Navigation</div>
                            <ul className="sidebar-navul">
                                <li className={`sidebar-navli${location.pathname === "/dashboard/admin-main-page" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/admin-main-page")}> <span className="sidebar-icon"><FaTachometerAlt /></span> Dashboard </li>
                                <li className={`sidebar-navli${location.pathname === "/dashboard/events" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/events")}> <span className="sidebar-icon"><FaCalendarAlt /></span> Manage Events </li>
                                <li className={`sidebar-navli${location.pathname === "/dashboard/booking-tickets" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/booking-tickets")}> <span className="sidebar-icon"><FaTicketAlt /></span> Booking & Tickets </li>
                                <li className={`sidebar-navli${location.pathname === "/dashboard/attendees" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/attendees-insights")}> <span className="sidebar-icon"><FaUsers /></span> Attendee Insights </li>
                                <li className={`sidebar-navli${location.pathname === "/dashboard/analytics-reports" ? " active" : ""}`} onClick={() => handleNavigate("/dashboard/analytics-reports")}> <span className="sidebar-icon"><FaChartBar /></span> Analytics & Reports </li>
                            </ul>
                            <hr className="sidebar-divider" />
                            <div className="sidebar-navdiv">Support & Management</div>
                            <ul className="sidebar-navul">
                                <li className="sidebar-navli" onClick={() => handleNavigate("/dashboard/messages")}>
                                    <span className="sidebar-icon"><FaHeadset /></span>
                                    Contact Support
                                </li>
                                <li className="sidebar-navli" onClick={() => handleNavigate("/dashboard/notifications")}>
                                    <span className="sidebar-icon"><FaBell /></span>
                                    Notifications
                                </li>
                                <li className="sidebar-navli" onClick={handleSettings}>
                                    <span className="sidebar-icon"><FaCog /></span>
                                    Settings
                                </li>
                            </ul>
                            <hr className="sidebar-divider" />
                            <div className="sidebar-navdiv">Account Management</div>
                            <ul className="sidebar-navul">
                                <li className="sidebar-navli" onClick={() => handleNavigate("/dashboard/manage-people")}> <span className="sidebar-icon"><FaUserCog /></span> Manage Users </li>
                                <li className="sidebar-navli logout" onClick={handleLogoutClick}>
                                    <span className="sidebar-icon"><FaSignOutAlt /></span>
                                    Logout
                                </li>
                            </ul>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
});

export default Sidebar;
