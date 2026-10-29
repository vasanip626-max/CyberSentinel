import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { FaUser, FaShieldAlt, FaSave } from "react-icons/fa";
import "./Dashboard.css";

function Settings() {
    const labUser = JSON.parse(localStorage.getItem("lab_user") || "{}");

    const [fullName, setFullName] = useState(labUser.fullName || labUser.name || "Logged User");
    const [email, setEmail]       = useState(labUser.email || "user@novasoft.com");
    const [company, setCompany]   = useState(labUser.company || "NovaSoft");

    const [emailNotifs, setEmailNotifs] = useState(true);
    const [secAlerts, setSecAlerts]     = useState(true);
    const [saved, setSaved]             = useState(false);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        const updatedUser = { ...labUser, fullName, name: fullName, email, company };
        localStorage.setItem("lab_user", JSON.stringify(updatedUser));

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="welcome-banner">
                    <h1>Account & Platform Settings</h1>
                    <p>Manage profile information, security settings, and notifications.</p>
                </div>

                {saved && (
                    <div style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "14px 20px", borderRadius: "10px", fontWeight: "700", marginBottom: "20px" }}>
                        ✓ Settings updated successfully!
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>

                    {/* Profile Form */}
                    <div className="dashboard-card">
                        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaUser style={{ color: "#2563eb" }} /> Personal Profile
                        </h2>

                        <form onSubmit={handleSaveSettings}>
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                />
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Company / Organization</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <FaSave /> Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Preferences & Security */}
                    <div className="dashboard-card">
                        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaShieldAlt style={{ color: "#2563eb" }} /> Preferences & Security
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0" }}>
                                <div>
                                    <h4 style={{ margin: 0, color: "#0f172a" }}>Email Notifications</h4>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Receive weekly activity summaries</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotifs}
                                    onChange={() => setEmailNotifs(!emailNotifs)}
                                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0" }}>
                                <div>
                                    <h4 style={{ margin: 0, color: "#0f172a" }}>Security Alert Signals</h4>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Instant alerts on suspicious account access</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={secAlerts}
                                    onChange={() => setSecAlerts(!secAlerts)}
                                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                />
                            </div>

                            <div>
                                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>API Credentials Key</h4>
                                <code style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", display: "block", color: "#2563eb" }}>
                                    ns_live_98a7b6c5d4e3f2a1
                                </code>
                            </div>

                            {/* Quick Change Password Form (Vulnerable to CSRF) */}
                            <div style={{ paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>Update Password</h4>
                                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
                                    Change account password (submits without anti-CSRF token).
                                </p>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newPass = e.target.new_pass.value;
                                    if (!newPass) return;
                                    try {
                                        const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";
                                        const targetEndpoint = `${apiUrl.replace(/\/api\/?$/, "")}/api/lab/change-password`;
                                        await fetch(targetEndpoint, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "X-User-Email": email
                                            },
                                            body: JSON.stringify({ password: newPass })
                                        });
                                        if (typeof window !== "undefined") {
                                            window.dispatchEvent(new Event("attack_detected"));
                                        }
                                        alert("Password updated successfully! (CSRF Threat logged to CyberSentinel)");
                                        e.target.reset();
                                    } catch (err) {
                                        alert("Failed to update password");
                                    }
                                }}>
                                    <input
                                        name="new_pass"
                                        type="password"
                                        placeholder="Enter new password..."
                                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "8px" }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            background: "#0f172a",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 14px",
                                            borderRadius: "6px",
                                            fontWeight: "600",
                                            fontSize: "12px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
