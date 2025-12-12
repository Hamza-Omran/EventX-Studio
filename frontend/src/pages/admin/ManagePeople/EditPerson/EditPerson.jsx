import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "@/api/axiosInstance";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import "./EditPerson.css";

const EditPerson = () => {
    const { userInfo } = useOutletContext();
    const navigate = useNavigate();
    const { id, type } = useParams();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        location: "",
        interests: "",
        image: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        async function fetchPerson() {
            try {
                if (type === "user") {
                    if (userInfo?.role === "user" && id !== userInfo?._id) {
                        setError("You are not allowed to edit this user.");
                        setLoading(false);
                        return;
                    }
                    const res = await api.get(`/auth/users/${id}`);
                    const user = res.data;
                    setForm({
                        name: user.name || "",
                        email: user.email || "",
                        password: "",
                        age: user.age || "",
                        gender: user.gender || "",
                        location: user.location || "",
                        interests: user.interests ? user.interests.join(", ") : "",
                        image: user.image || ""
                    });
                    setCurrentImage(user.image || "");
                } else {
                    const res = await api.get(`/admins/${id}`);
                    const admin = res.data;
                    setForm({
                        name: admin.name || "",
                        email: admin.email || "",
                        password: "",
                        image: admin.image || ""
                    });
                    setCurrentImage(admin.image || "");
                }
            } catch {
                setError("Failed to load person data.");
            } finally {
                setLoading(false);
            }
        }
        if ((type === "user" && userInfo?._id && userInfo?.role) || type === "admin") fetchPerson();
    }, [id, type, userInfo?._id, userInfo?.role]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview("");
        setCurrentImage("");
    };
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            if (form.password) formData.append('password', form.password);

            if (type === "user") {
                formData.append('age', form.age);
                formData.append('gender', form.gender);
                formData.append('location', form.location);
                formData.append('interests', form.interests.split(",").map(i => i.trim()).filter(i => i).join(','));
            }

            if (selectedImage) {
                formData.append('image', selectedImage);
            } else if (!currentImage) {
                formData.append('removeImage', 'true');
            }

            if (type === "user") {
                await api.put(`/auth/users/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await api.put(`/admins/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            navigate(-1);
        } catch {
            setError("Failed to update person.");
        }
    };
    if (loading) return <LoadingDots />;
    if (error) return <div className="edit-person-root">{error}</div>;
    return (
        <div className="edit-person-root">
            <h2>Edit {type === "user" ? "User" : "Admin"}</h2>
            <form className="edit-person-form" onSubmit={handleSubmit}>

                {/* Current Image Display */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 12px',
                        border: '2px solid #e0e0e0',
                        background: '#f7f7fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : currentImage ? (
                            <img
                                src={currentImage.startsWith('http') ? currentImage : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${currentImage}`}
                                alt="Current profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <svg width="40" height="40" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                            </svg>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="image-upload-edit"
                    />
                    <div className="image-btns">
                        <label htmlFor="image-upload-edit" style={{
                            background: '#007bff',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginRight: '8px'
                        }}>
                            Change Image
                        </label>
                        {(imagePreview || currentImage) && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{
                                    background: '#ff5252',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                {imagePreview ? 'Cancel Upload' : 'Remove Image'}
                            </button>
                        )}
                    </div>
                </div>

                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} required />
                <label>Password</label>
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        style={{ paddingRight: "40px", width: "100%" }}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#666"
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {type === "user" && <>
                    <label>Age</label>
                    <input name="age" value={form.age} onChange={handleChange} type="number" min="0" />
                    <label>Gender</label>
                    <input name="gender" value={form.gender} onChange={handleChange} />
                    <label>Location</label>
                    <input name="location" value={form.location} onChange={handleChange} />
                    <label>Interests (comma separated)</label>
                    <input name="interests" value={form.interests} onChange={handleChange} />
                </>}
                {error && <div className="edit-person-error">{error}</div>}
                <button className="edit-person-btn" type="submit">Edit</button>
                <button className="edit-person-cancel" type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditPerson;
