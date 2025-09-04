import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import './EventAdd_Edit.css';
import '../EventDetails/EventDetails.css';
import SeatAllocation from "@/components/SeatAllocation/SeatAllocation";

const initialState = {
    name: "",
    venue: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
    seatAmount: "",
    availableSeats: "",
    popularity: "Low",
    tags: "",
    expectedAttendance: ""
};

const TAG_OPTIONS = ["#Music", "#Festival", "#Tech", "#Food", "#Art", "#Sports", "#Conference", "#Workshop"];

const seatGrid = Array.from({ length: 5 }, () =>
    Array.from({ length: 10 }, () => ({ status: "Available" }))
);

const AddEvent = () => {
    const { id } = useParams();
    const [form, setForm] = useState(initialState);
    const [seats, setSeats] = useState(seatGrid);
    const [selectedTags, setSelectedTags] = useState([]);
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    useEffect(() => {
        if (isEdit) {
            api.get(`/events/${id}`).then(res => {
                let startTime = "";
                let endTime = "";
                if (res.data.time) {
                    const parts = res.data.time.split("-").map(s => s.trim());
                    startTime = parts[0] || "";
                    endTime = parts[1] || "";
                }
                setForm({
                    ...res.data,
                    date: res.data.date?.slice(0, 10),
                    startTime,
                    endTime
                });

                const flatSeats = res.data.seatAllocation || [];
                const rows = [];
                for (let i = 0; i < flatSeats.length; i += 10) {
                    rows.push(flatSeats.slice(i, i + 10));
                }
                setSeats(rows.length ? rows : seatGrid);
                setSelectedTags(res.data.tags || []);
            });
        } else {
            setForm(initialState);
            setSeats(seatGrid);
            setSelectedTags([]);
        }
    }, [id, isEdit]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleTagChange = e => {
        const value = e.target.value;
        if (!selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value]);
        }
    };

    const handleTagRemove = tag => setSelectedTags(selectedTags.filter(t => t !== tag));

    const encodeSeatStatus = status =>
        status === "Available" ? "Available" :
            status === "Reserved" ? "Reserved" :
                status === "Paid" ? "Paid" : "Available";

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const seatAllocation = seats.flat().map((seat, idx) => ({
                seatNumber: String(idx + 1),
                status: encodeSeatStatus(seat.status)
            }));
            const time = form.startTime && form.endTime ? `${form.startTime} - ${form.endTime}` : "";
            if (isEdit) {
                await api.put(`/events/${id}`, { ...form, time, seatAllocation, tags: selectedTags });
                alert("Event updated successfully!");
            } else {
                await api.post("/events", { ...form, time, seatAllocation, tags: selectedTags });
                alert("Added successfully!");
            }
            window.location.replace("/dashboard/events");
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="event-add-container">
            <button className="event-add-back" onClick={() => navigate(-1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <h2 className="event-add-title">{isEdit ? "Edit Event Details" : "Add Event Details"}</h2>
            <form className="event-add-form" onSubmit={handleSubmit}>
                <div className="event-add-row three-to-one">
                    <div className="event-add-field">
                        <label>Event Name</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" required />
                    </div>
                    <div className="event-add-field">
                        <label>Event Date</label>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                    </div>
                </div>
                <div className="event-add-row three-to-one">
                    <div className="event-add-field">
                        <label>Event Venue</label>
                        <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" required />
                    </div>
                    <div className="event-add-field">
                        <label>Event Time</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
                            <span style={{ alignSelf: 'center' }}>to</span>
                            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="event-add-field event-add-description">
                    <label>Event Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
                </div>
                <div className="event-add-row">
                    <div className="event-add-field">
                        <label>Ticket Price</label>
                        <input name="ticketPrice" value={form.ticketPrice} onChange={handleChange} placeholder="Ticket Price" required />
                    </div>
                    <div className="event-add-field">
                        <label>Seat Amount</label>
                        <input name="seatAmount" value={form.seatAmount} onChange={handleChange} placeholder="Seat Amount" required />
                    </div>
                    <div className="event-add-field">
                        <label>Available Seats</label>
                        <input name="availableSeats" value={form.availableSeats} onChange={handleChange} placeholder="Available Seats" required />
                    </div>
                    <div className="event-add-field">
                        <label>Popularity</label>
                        <select name="popularity" value={form.popularity} onChange={handleChange}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <div className="event-add-row">
                    <div className="event-add-seat-section">
                        <SeatAllocation seats={seats} onChange={setSeats} />
                    </div>
                    <div className="event-add-side-fields">
                        <div className="event-add-field">
                            <label>Tags</label>
                            <div className="event-add-tags-autocomplete">
                                <select onChange={handleTagChange} value="">
                                    <option value="" disabled>Select tag</option>
                                    {TAG_OPTIONS.filter(tag => !selectedTags.includes(tag)).map(tag => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                                <div className="event-add-tags-selected">
                                    {selectedTags.map(tag => (
                                        <span key={tag} className="event-add-tag-chip">
                                            {tag}
                                            <button type="button" className="event-add-tag-remove" onClick={() => handleTagRemove(tag)}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="event-add-field">
                            <label>Expected Attendance</label>
                            <input name="expectedAttendance" value={form.expectedAttendance} onChange={handleChange} placeholder="Expected Attendance" />
                        </div>
                    </div>
                </div>
                <div className="event-add-actions">
                    <button type="submit" className="event-add-btn">{isEdit ? "Edit" : "Add"}</button>
                </div>
            </form>
        </div>
    );
};

export default AddEvent;
