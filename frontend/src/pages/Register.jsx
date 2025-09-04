import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "", age: 0, interests: "", gender: "", location: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInput = (e) => {
        if (e.target.name === "age") {
            setForm({ ...form, age: e.target.value ? parseInt(e.target.value, 10) : "" });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        if (e.target.name === "password" && e.target.value.length < 6) {
            setError("Password must be at least 6 characters long");
        } else if (e.target.name === "confirmPassword" && form.password !== e.target.value) {
            setError("Passwords do not match");
        } else if (e.target.name === "email" && !e.target.value) {
            setError("Email is required");
        } else {
            setError("");
        }
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        if (form.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!form.age || isNaN(form.age) || form.age <= 0) {
            setError("Please enter a valid age.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('age', form.age);
            formData.append('interests', form.interests.split(",").map(i => i.trim()).filter(Boolean).join(','));
            formData.append('gender', form.gender);
            formData.append('location', form.location);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await api.post("/auth/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/login");
        } catch (err) {
            if (err.response?.data?.message === "User already exists") {
                setError("A user with this email already exists. Please use a different email or login.");
            } else {
                setError(err.response?.data?.message || "Something went wrong");
            }
        }
    };

    useEffect(() => {
        if (error === "Passwords do not match" && form.password === confirmPassword) {
            setError("");
        }
    }, [form.password, confirmPassword, error]);

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <div className="register-logo">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#00C896" />
                        <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="28" fontFamily="Arial" dy=".3em">*</text>
                    </svg>
                </div>
                <h2 className="register-title">Create Your Account</h2>
                <p className="register-subtitle">Join EventX Studio and never miss an event.</p>
                {error && <p className="register-error">{error}</p>}
                <div className="register-field">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleInput}
                        required
                    />
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
                    </span>
                </div>

                <div className="register-field">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #e0e0e0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#fff'
                    }}>
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span style={{ color: selectedImage ? '#333' : '#aaa' }}>
                            {selectedImage ? selectedImage.name : 'Choose profile picture (optional)'}
                        </span>
                    </label>
                    {imagePreview && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #e0e0e0'
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{
                                    background: '#ff5252',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <div className="register-field">
                    <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleInput}
                        required
                    />
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
                    </span>
                </div>
                <div className="register-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleInput}
                        required
                    />
                    <span className="register-icon">
                    </span>
                    <span className="eye-icon" onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /><circle cx="12" cy="12" r="3" /><line x1="3" y1="3" x2="21" y2="21" stroke="#aaa" strokeWidth="2" /></svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /></svg>
                        )}
                    </span>
                </div>
                <div className="register-field">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => {
                            setConfirmPassword(e.target.value);
                            if (form.password && e.target.value && form.password !== e.target.value) {
                                setError("Passwords do not match");
                            } else {
                                setError("");
                            }
                        }}
                        required
                    />
                    <span className="register-icon">
                    </span>
                    <span className="eye-icon" onClick={() => setShowConfirmPassword((v) => !v)}>
                        {showConfirmPassword ? (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /><circle cx="12" cy="12" r="3" /><line x1="3" y1="3" x2="21" y2="21" stroke="#aaa" strokeWidth="2" /></svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /></svg>
                        )}
                    </span>
                </div>
                <div className="register-field">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleInput}
                        required
                    />
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#aaa">A</text></svg>
                    </span>
                </div>
                <div className="register-field">
                    <input
                        type="text"
                        name="interests"
                        placeholder="Interests (comma separated)"
                        value={form.interests}
                        onChange={handleInput}
                    />
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#aaa">I</text></svg>
                    </span>
                </div>
                <div className="register-field">
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleInput}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#aaa">G</text></svg>
                    </span>
                </div>
                <div className="register-field">
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleInput}
                        required
                    />
                    <span className="register-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#aaa">L</text></svg>
                    </span>
                </div>
                <button type="submit" className="register-btn">Register</button>
                <div className="register-links">
                    <span>Already have an account? <a href="/login" className="register-link">Login here</a></span>
                </div>
            </form>
        </div>
    );
};

export default Register;
