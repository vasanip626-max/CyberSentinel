import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaRocket, FaEnvelope, FaLock,
    FaEye, FaEyeSlash, FaSignInAlt,
    FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { labLogin } from "../../services/labApi";
import "./Login.css";

function VulnerableLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail]     = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors]   = useState({});
    const [serverError, setServerError] = useState("");
    const [successMsg, setSuccessMsg]   = useState(
        location.state?.registered ? "Account created! Please sign in with your credentials." : ""
    );

    const validate = () => {
        const e = {};
        if (!email.trim())    e.email    = "Email is required";
        else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) e.email = "Invalid email";
        if (!password)        e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError("");
        setSuccessMsg("");
        try {

            const res = await labLogin(email, password);
            const loggedUser = res.data.user || {};

            // Save logged-in user and token
            localStorage.setItem("lab_user", JSON.stringify(loggedUser));
            if (res.data.token) {
                localStorage.setItem("lab_token", res.data.token);
            }

            // Route to Admin Panel if Administrator, else Normal User Dashboard
            if (loggedUser.role === "Admin" || email.trim().toLowerCase() === "admin@gmail.com") {
                navigate("/lab/admin");
            } else {
                navigate("/lab/dashboard");
            }
        }
catch (err) {

    setServerError(

        err.response?.data?.message ||

        "Login failed. Check your credentials."

    );

}
finally {

    setLoading(false);

}
    };

    return (
        <div className="vlogin-page">

            <div className="vlogin-blob blob1"></div>
            <div className="vlogin-blob blob2"></div>
            <div className="vlogin-grid"></div>

            {/* Navbar */}
            <header className="vlogin-nav">
                <Link to="/lab" className="vlogin-logo">
                    <div className="vlogin-logo-icon"><FaRocket /></div>
                    <div className="vlogin-logo-text">
                        <span>NovaSoft</span>
                        <small>The Modern SaaS Platform</small>
                    </div>
                </Link>
                <div className="vlogin-nav-right">
                    New to NovaSoft?&nbsp;
                    <Link to="/lab/register">Create Account</Link>
                </div>
            </header>

            <main className="vlogin-main">

                {/* Left panel */}
                <div className="vlogin-left">
                    <div className="vlogin-left-inner">
                        <div className="vlogin-brand-icon"><FaRocket /></div>
                        <h2>Welcome back to NovaSoft</h2>
                        <p>Sign in to access your dashboard, analytics, and cloud infrastructure.</p>

                        <div className="vlogin-features">
                            {[
                                "Real-time analytics dashboard",
                                "Auto-scaling cloud infrastructure",
                                "Enterprise-grade security",
                                "99.9% uptime guarantee"
                            ].map((f, i) => (
                                <div key={i} className="vlogin-feature">
                                    <FaCheckCircle /> {f}
                                </div>
                            ))}
                        </div>

                        <div className="vlogin-mini-card">
                            <div className="vlogin-mini-card-header">
                                <div className="vlogin-dot d-red"></div>
                                <div className="vlogin-dot d-yellow"></div>
                                <div className="vlogin-dot d-green"></div>
                                <span>Dashboard • Live</span>
                            </div>
                            <div className="vlogin-mini-stats">
                                <div><strong>12,482</strong><span>Active Users</span></div>
                                <div><strong>99.9%</strong><span>Uptime</span></div>
                                <div><strong>342</strong><span>Deployments</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="vlogin-right">
                    {successMsg && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)",
                            color: "#86efac", padding: "12px 16px", borderRadius: "10px",
                            marginBottom: "20px", fontSize: "14px"
                        }}>
                            <FaCheckCircle style={{ color: "#22c55e", flexShrink: 0 }} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {serverError && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)",
                            color: "#fca5a5", padding: "12px 16px", borderRadius: "10px",
                            marginBottom: "20px", fontSize: "14px"
                        }}>
                            <FaTimesCircle style={{ color: "#ef4444", flexShrink: 0 }} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form className="vlogin-form" onSubmit={handleSubmit}>

                        <div className="vlogin-field">
                            <label>Email Address</label>
                            <div className={`vlogin-input-wrap ${errors.email ? "err" : ""}`}>
                                <FaEnvelope className="vlogin-icon" />
                                <input
                                    type="text" placeholder="you@company.com"
                                    value={email} onChange={(e) => { setEmail(e.target.value); setErrors(er=>({...er,email:""})); }}
                                />
                            </div>
                            {errors.email && <small>{errors.email}</small>}
                        </div>

                        <div className="vlogin-field">
                            <label>Password</label>
                            <div className={`vlogin-input-wrap ${errors.password ? "err" : ""}`}>
                                <FaLock className="vlogin-icon" />
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="Your password"
                                    value={password} onChange={(e) => { setPassword(e.target.value); setErrors(er=>({...er,password:""})); }}
                                />
                                <button type="button" className="vlogin-eye" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <small>{errors.password}</small>}
                        </div>

                        <div className="vlogin-row">
                            <label className="vlogin-check">
                                <input type="checkbox" /> <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="vlogin-forgot">Forgot Password?</a>
                        </div>

                        <button type="submit" className="vlogin-btn" disabled={loading}>
                            {loading
                                ? <span className="vlogin-spinner"></span>
                                : <><FaSignInAlt /> Sign In</>
                            }
                        </button>

                        <div className="vlogin-divider"><span>or</span></div>

                        <div className="vlogin-register">
                            Don't have an account?&nbsp;
                            <Link to="/lab/register">Create one free</Link>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}

export default VulnerableLogin;
