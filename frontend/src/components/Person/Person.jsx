import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import api from "@/api/axiosInstance";
import "./Person.css";

const Person = ({ _id, name, email, age, gender, location, interests, image, createdAt, updatedAt, onEdit, onDelete, type, currentAdminId }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);
    const handleDelete = async () => {
        if (type === "admin" && email === "admin@a.com") {
            alert("Can't delete, the super admin");
            setShowConfirm(false);
            return;
        }
        if (type === "admin" && currentAdminId === _id) {
            alert("You cannot delete yourself");
            setShowConfirm(false);
            return;
        }
        try {
            if (type === "user") {
                await api.delete(`/auth/users/${_id}`);
                alert("User deleted successfully");
                window.location.reload();
            } else if (type === "admin") {
                await api.delete(`/admins/${_id}`);
                alert("Admin deleted successfully");
                window.location.reload();
            } else {
                alert("Unknown type, cannot delete");
            }
            setShowConfirm(false);
            if (onDelete) onDelete();
        } catch (err) {
            if (err.response?.status === 404) {
                alert(type === "user" ? "User not found or already deleted" : "Admin not found or already deleted");
            } else {
                alert("Failed to delete");
            }
            setShowConfirm(false);
        }
    };
    return (
        <div className="person-card">
            <div className="person-main">
                <div className="person-menu" ref={menuRef}>
                    <FaEllipsisV onClick={() => setMenuOpen(v => !v)} className="menu-icon" />
                    {menuOpen && (
                        <div className="person-menu-dropdown">
                            <div className="person-menu-item person-menu-edit" onClick={() => { setMenuOpen(false); onEdit && onEdit(); }}>Edit</div>
                            <div className="relative-container">
                                <div className="person-menu-item person-menu-delete" onClick={() => setShowConfirm(true)}>Delete</div>
                                {showConfirm && (
                                    <div className="person-confirm-modal person-confirm-above">
                                        <div>Are you sure you want to delete?</div>
                                        <div className="buttons">
                                            <button className="person-confirm-btn" onClick={handleDelete}>Yes</button>
                                            <button className="person-cancel-btn" onClick={() => setShowConfirm(false)}>No</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="person-image-container">
                    {image ? (
                        <img
                            src={`http://localhost:5000/${image}`}
                            alt={`${name}'s profile`}
                        />
                    ) : (
                        <svg width="40" height="40" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                        </svg>
                    )}
                </div>
                <div className="person-name">{name}</div>
                <div className="person-email">{email}</div>
                <div className="person-id">ID: {_id}</div>
            </div>
            <div className="person-details">
                {createdAt && <div><b>Created:</b> {new Date(createdAt).toLocaleString()}</div>}
                {updatedAt && <div><b>Updated:</b> {new Date(updatedAt).toLocaleString()}</div>}
                {age && <div><b>Age:</b> {age}</div>}
                {gender && <div><b>Gender:</b> {gender}</div>}
                {location && <div><b>Location:</b> {location}</div>}
                {interests && interests.length > 0 && (
                    <div><b>Interests:</b> {interests.join(", ")}</div>
                )}
            </div>
        </div>
    );
};

export default Person;
