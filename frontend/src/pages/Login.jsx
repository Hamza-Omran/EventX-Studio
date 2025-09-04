import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "", role: "user", name: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === "password" && e.target.value.length < 6) {
            setError("Password must be at least 6 characters long");
        } else if (e.target.name === "email" && !e.target.value) {
            setError("Email is required");
        } else if (e.target.name === "name" && !e.target.value) {
            setError("Name is required");
        } else {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", form);
            console.log('Login response:', response.data);

            // Store token in localStorage for authorization headers
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                console.log('Token stored:', response.data.token);
            } else {
                console.log('No token in response:', response.data);
            }

            if (form.role === "admin") {
                navigate("/dashboard/admin-main-page");
            } else {
                navigate("/dashboard/events");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    const handleRoleSelect = (role) => {
        setForm({ ...form, role });
        setTimeout(() => setDropdownOpen(false), 300);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-logo">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#00C896" />
                        <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="28" fontFamily="Arial" dy=".3em">*</text>
                    </svg>
                </div>
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Login to continue to your events and dashboard.</p>
                {error && <p className="login-error">{error}</p>}
                <div className="login-field">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onInput={handleInput}
                        required
                    />
                    <span className="login-icon">
                        <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
                    </span>
                </div>
                <div className="login-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onInput={handleInput}
                        required
                    />
                    <span className="login-icon">
                    </span>
                    <span className="eye-icon" onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /><circle cx="12" cy="12" r="3" /><line x1="3" y1="3" x2="21" y2="21" stroke="#aaa" strokeWidth="2" /></svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M2 12C4.5 7 7.5 4 12 4s7.5 3 10 8c-2.5 5-5.5 8-10 8s-7.5-3-10-8z" /></svg>
                        )}
                    </span>
                </div>
                <div className="login-field custom-dropdown">
                    <div
                        className={`dropdown-selected${form.role === "admin" ? " admin-selected" : " user-selected"}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        tabIndex={0}
                        onBlur={() => setDropdownOpen(false)}
                    >
                        {form.role === "user" ? "User" : "Admin"}
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <div className={`dropdown-options${dropdownOpen ? " open" : ""}`}>
                        <div
                            className={`dropdown-option user${form.role === "user" ? " selected" : ""}`}
                            onMouseDown={() => handleRoleSelect("user")}
                        >
                            User
                        </div>
                        <div
                            className={`dropdown-option admin${form.role === "admin" ? " selected" : ""}`}
                            onMouseDown={() => handleRoleSelect("admin")}
                        >
                            Admin
                        </div>
                    </div>
                </div>
                <button type="submit" className="login-btn">Login</button>
                <div className="login-links">
                    <span>Don't have an account? <a href="/register" className="login-link">Register here</a></span>
                </div>
            </form>
        </div>
    );
};

export default Login;
