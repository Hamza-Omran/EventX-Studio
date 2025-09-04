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
                        <>
                            <img
                                src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${image}`}
                                alt={`${name}'s profile`}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                                style={{ display: 'block', width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                            <div
                                className="user-avatar-placeholder"
                                style={{ display: 'none', width: '40px', height: '40px' }}
                            />
                        </>
                    ) : (
                        <div
                            className="user-avatar-placeholder"
                            style={{ width: '40px', height: '40px' }}
                        />
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
