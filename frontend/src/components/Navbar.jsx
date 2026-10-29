import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaSearch,
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaExclamationTriangle,
    FaTimes
} from "react-icons/fa";

function Navbar({ unreadCount = 0, latestAttacks = [] }) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        navigate("/login");
    };

    return (
        <nav className="navbar" style={{ position: "relative", zIndex: 1000 }}>
            {/* Left Logo */}
            <div className="navbar-left">
                <div className="logo">
                    <FaShieldAlt />
                </div>
                <div className="logo-text">
                    <h2>CYBER SENTINEL</h2>
                    <p>AI Powered Threat Detection Platform</p>
                </div>
            </div>

            {/* Center Search */}
            <div className="navbar-search">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search attacks, users, IP..."
                />
            </div>

            {/* Right Controls */}
            <div className="navbar-right">
                {/* Notification Bell */}
                <div style={{ position: "relative" }}>
                    <button
                        className="notification-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ position: "relative", cursor: "pointer" }}
                    >
                        <FaBell />
                        {unreadCount > 0 && (
                            <span style={{
                                position: "absolute",
                                top: "-4px",
                                right: "-4px",
                                background: "#FF4D6D",
                                color: "white",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                fontSize: "11px",
                                fontWeight: "800",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 10px #FF4D6D"
                            }}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Panel with solid background and highest z-index */}
                    {showDropdown && (
                        <div style={{
                            position: "absolute",
                            right: 0,
                            top: "55px",
                            width: "360px",
                            background: "#0F172A",
                            border: "1px solid rgba(0, 200, 255, 0.4)",
                            borderRadius: "16px",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.95)",
                            padding: "18px",
                            zIndex: 999999,
                            color: "#E2E8F0"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                                <h4 style={{ margin: 0, color: "#00C8FF", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaExclamationTriangle style={{ color: "#FF4D6D" }} /> Live Security Alerts ({latestAttacks.length})
                                </h4>
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "16px" }}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
                                {latestAttacks.length === 0 ? (
                                    <p style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center", margin: "10px 0" }}>No security threat notifications.</p>
                                ) : (
                                    latestAttacks.slice(0, 6).map((a, idx) => (
                                        <div key={idx} style={{
                                            background: "#1E293B",
                                            borderLeft: "4px solid #FF4D6D",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                                <strong style={{ color: "#FF4D6D", fontSize: "13px" }}>🚨 {a.attack || a.attack_type || "Threat"}</strong>
                                                <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: "600" }}>{a.time || "Just Now"}</span>
                                            </div>
                                            <p style={{ color: "#CBD5E1", fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
                                                User <code>{a.actor_user || "Attacker"}</code> accessed target <code>{a.target_user || a.ip}</code>
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-card">
                    <FaUserCircle className="profile-icon" />
                    <div>
                        <h4>Administrator</h4>
                        <p>Security Analyst</p>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;