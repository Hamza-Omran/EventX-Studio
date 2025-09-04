import { useEffect, useState, useRef } from "react";
import { useNavigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import api from "@/api/axiosInstance";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import { FaEdit, FaTrash, FaInfoCircle, FaTimes, FaSlidersH, FaChevronDown } from "react-icons/fa";
import './Events.css';
import EventCard from "@/components/EventCard/EventCard";

const Events = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get("search") || "";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState({ tags: [], place: "", money: "", seats: "", tickets: "", status: [] });
    const [tagInput, setTagInput] = useState("");
    const [sortBy, setSortBy] = useState("Status");
    const [search, setSearch] = useState(initialSearch);
    const [filterDate, setFilterDate] = useState("");
    const TAG_OPTIONS = ["#Music", "#Festival", "#Tech", "#Food", "#Art", "#Sports", "#Conference", "#Workshop"];
    const navigate = useNavigate();
    const isEventsPage = location.pathname === "/dashboard/events";
    const menuRef = useRef();
    const tagsMenuRef = useRef();
    const filterMenuRef = useRef();

    const { userInfo } = useOutletContext();
    const userRole = userInfo?.role;
    const displayUser = userInfo;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/optimized/events/list");
                setEvents(res.data);
            } catch {
                try {
                    const res = await api.get("/events");
                    setEvents(res.data);
                } catch {
                    setEvents([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleTagsMenuClickOutside = (e) => {
            if (tagsMenuRef.current && !tagsMenuRef.current.contains(e.target)) {
                setTagInput("");
            }
        };
        document.addEventListener("mousedown", handleTagsMenuClickOutside);
        return () => document.removeEventListener("mousedown", handleTagsMenuClickOutside);
    }, []);

    useEffect(() => {
        if (!filterOpen) return;
        const handleClickOutside = (e) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterOpen]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (search) params.set("search", search); else params.delete("search");
        navigate({ search: params.toString() }, { replace: true });
    }, [search, location.search, navigate]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/events/${id}`);
            alert("Deleted successfully!");
            window.location.reload();
        } catch (err) {
            alert("Error deleting event: " + (err.response?.data?.message || err.message));
        }
    };

    const applyFilters = () => {
        let filtered = [...events];
        if (filter.tags.length) filtered = filtered.filter(ev => ev.tags && filter.tags.every(tag => ev.tags.includes(tag)));
        if (filter.place) filtered = filtered.filter(ev => ev.venue && ev.venue.toLowerCase().includes(filter.place.toLowerCase()));
        if (filter.money) filtered = filtered.filter(ev => Number(ev.ticketPrice) >= Number(filter.money));
        if (filter.seats) filtered = filtered.filter(ev => Number(ev.seatAmount) >= Number(filter.seats));
        if (filter.tickets) filtered = filtered.filter(ev => Number(ev.availableSeats) >= Number(filter.tickets));
        if (filter.status.length) filtered = filtered.filter(ev => filter.status.includes(ev.status));
        return filtered;
    };

    const filteredEvents = (() => {
        let result = filterOpen ? applyFilters() : (selectedStatus === "All" ? events : events.filter(ev => ev.status === selectedStatus));
        if (search) {
            result = result.filter(ev => ev.name && ev.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (filterDate) {
            result = result.filter(ev => ev.date && ev.date.slice(0, 10) === filterDate);
        }
        if (sortBy === "Date") {
            result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === "Status") {
            const statusOrder = { "Up-Coming": 1, "Pending": 2, "Closed": 3 };
            result = [...result].sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
        }
        return result;
    })();

    if (loading) {
        return (
            <div className="events-loading-center">
                <LoadingDots />
            </div>
        );
    }

    return (
        <>
            {isEventsPage && (
                <>
                    <div className="dashboard-header">
                        <div className="header-user-profile">
                            {displayUser?.image ? (
                                <img
                                    src={displayUser.image.startsWith('http') ? displayUser.image : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${displayUser.image}`}
                                    alt={displayUser.name || 'User'}
                                    className="header-user-image"
                                    title={displayUser.name || 'User Profile'}
                                />
                            ) : (
                                <svg width="35" height="35" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                                </svg>
                            )}
                        </div>

                        <div className={`dashboard-actions${userRole === "user" ? " user-actions-end" : ""}`}>
                            {userRole === "admin" && (
                                <div className="left-wing">
                                    <button className="new-event-btn" onClick={() => navigate("/dashboard/events/add-event")}>+ New Event</button>
                                    <button className="insights-btn" onClick={() => navigate("/dashboard/attendees-insights")}>Attendee Insights</button>
                                </div>
                            )}
                            <div className="right-wing">
                                <div className="dashboard-actions-top">
                                    <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
                                        <FaSlidersH className="filter-slider-icon" />
                                        <span className="filter-text">Filter</span>
                                        <FaChevronDown className="filter-chevron-icon" />
                                    </button>
                                    <input className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                                </div>
                                <div className="dashboard-actions-bottom">
                                    <div className="sort">
                                        <label htmlFor="sort-select" className="sort-label">Sort By:</label>
                                        <select id="sort-select" className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                            <option value="Status">Status</option>
                                            <option value="Date">Date</option>
                                        </select>
                                    </div>
                                    <input type="date" className="date-picker" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        filterOpen && (
                            <div className="filter-menu" ref={filterMenuRef}>
                                <div className="filter-menu-columns">
                                    <div className="filter-menu-col">
                                        <div className="filter-section">
                                            <label>Tags</label>
                                            <div className="filter-tags-combo" ref={tagsMenuRef}>
                                                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Type to search tags..." />
                                                {tagInput && (
                                                    <div className="filter-tags-list">
                                                        {TAG_OPTIONS.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !filter.tags.includes(tag)).map(tag => (
                                                            <div key={tag} className="filter-tag-option" onClick={() => { setFilter({ ...filter, tags: [...filter.tags, tag] }); setTagInput(""); }}>
                                                                {tag}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="filter-tags-selected">
                                                {filter.tags.map(tag => (
                                                    <span key={tag} className="filter-tag-chip">
                                                        {tag}
                                                        <button type="button" className="filter-tag-remove" onClick={() => setFilter({ ...filter, tags: filter.tags.filter(t => t !== tag) })}>&times;</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="filter-section">
                                            <label>Place</label>
                                            <input type="text" value={filter.place} onChange={e => setFilter({ ...filter, place: e.target.value })} />
                                        </div>
                                        <div className="filter-section">
                                            <label>Money</label>
                                            <input type="number" value={filter.money} onChange={e => setFilter({ ...filter, money: e.target.value })} />
                                        </div>
                                        <div className="filter-section">
                                            <label>Seats</label>
                                            <input type="number" value={filter.seats} onChange={e => setFilter({ ...filter, seats: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="filter-menu-col">
                                        <div className="filter-section">
                                            <label>Tickets</label>
                                            <input type="number" value={filter.tickets} onChange={e => setFilter({ ...filter, tickets: e.target.value })} />
                                        </div>
                                        <div className="filter-section">
                                            <label>Status</label>
                                            <div className="check-boxes">
                                                <label><input type="checkbox" checked={filter.status.includes("Up-Coming")} onChange={e => setFilter({ ...filter, status: e.target.checked ? [...filter.status, "Up-Coming"] : filter.status.filter(s => s !== "Up-Coming") })} /> Up-Coming</label>
                                                <label><input type="checkbox" checked={filter.status.includes("Pending")} onChange={e => setFilter({ ...filter, status: e.target.checked ? [...filter.status, "Pending"] : filter.status.filter(s => s !== "Pending") })} /> Pending</label>
                                                <label><input type="checkbox" checked={filter.status.includes("Closed")} onChange={e => setFilter({ ...filter, status: e.target.checked ? [...filter.status, "Closed"] : filter.status.filter(s => s !== "Closed") })} /> Closed</label>
                                            </div>
                                        </div>
                                        <button className="filter-reset-btn" onClick={() => { setFilter({ tags: [], place: "", money: "", seats: "", tickets: "", status: [] }); setTagInput(""); setFilterOpen(false); }}>Reset</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className="events-dashboard">
                        <div className="event-status-tabs">
                            <span className={`tab upcoming${selectedStatus === "Up-Coming" ? " active" : ""}`} onClick={() => selectedStatus === "Up-Coming" ? null : setSelectedStatus("Up-Coming")}>
                                {selectedStatus === "Up-Coming" ? <FaTimes className="tab-x" onClick={() => setSelectedStatus("All")} /> : <span className="tab-dot tab-dot-blue">●</span>} Up-Coming Events
                            </span>
                            <span className={`tab pending${selectedStatus === "Pending" ? " active" : ""}`} onClick={() => selectedStatus === "Pending" ? null : setSelectedStatus("Pending")}>
                                {selectedStatus === "Pending" ? <FaTimes className="tab-x" onClick={() => setSelectedStatus("All")} /> : <span className="tab-dot tab-dot-green">●</span>} Pending Events
                            </span>
                            <span className={`tab closed${selectedStatus === "Closed" ? " active" : ""}`} onClick={() => selectedStatus === "Closed" ? null : setSelectedStatus("Closed")}>
                                {selectedStatus === "Closed" ? <FaTimes className="tab-x" onClick={() => setSelectedStatus("All")} /> : <span className="tab-dot tab-dot-red">●</span>} Closed Events
                            </span>
                        </div>
                        <div className="event-cards">
                            {filteredEvents.map(event => (
                                <div key={event._id}>
                                    <EventCard
                                        event={event}
                                        menuOpen={menuOpen}
                                        setMenuOpen={setMenuOpen}
                                        confirmDelete={userRole === "admin" ? confirmDelete : null}
                                        setConfirmDelete={userRole === "admin" ? setConfirmDelete : () => { }}
                                        handleDelete={userRole === "admin" ? handleDelete : () => { }}
                                        navigate={navigate}
                                        isAdmin={userRole === "admin"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Outlet context={{ userInfo }} />
        </>
    );
}; export default Events;
