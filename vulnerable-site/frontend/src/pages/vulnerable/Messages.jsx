import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { FaPaperPlane, FaUserCircle, FaComments } from "react-icons/fa";
import "./Dashboard.css";

function Messages() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "John Smith", role: "HR Manager", time: "10:15 AM", text: "Welcome to NovaSoft Team Portal! Please complete your security training." },
        { id: 2, sender: "Emily Johnson", role: "Finance Head", time: "11:30 AM", text: "Q3 Financial reports have been uploaded to the Reports tab." },
        { id: 3, sender: "Arjun Mehta", role: "Cyber Security", time: "01:45 PM", text: "All employees please update your password credentials before Friday." }
    ]);

    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const labUser = JSON.parse(localStorage.getItem("lab_user") || "{}");

        const msg = {
            id: Date.now(),
            sender: labUser.fullName || labUser.name || "Logged User",
            role: labUser.role || "Team Member",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: newMessage
        };

        setMessages([...messages, msg]);
        setNewMessage("");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="welcome-banner">
                    <h1>Team Messages & Announcements</h1>
                    <p>Communicate with NovaSoft team members and department heads.</p>
                </div>

                <div className="dashboard-card" style={{ maxWidth: "850px" }}>
                    <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaComments style={{ color: "#2563eb" }} /> Live Team Chat & Feedback
                    </h2>

                    {/* Messages List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px", maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }}>
                        {messages.map((m) => (
                            <div key={m.id} style={{
                                background: "#f8fafc",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "16px",
                                display: "flex",
                                gap: "14px"
                            }}>
                                <FaUserCircle style={{ fontSize: "38px", color: "#2563eb", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                        <h4 style={{ margin: 0, color: "#0f172a", fontSize: "15px", fontWeight: "700" }}>
                                            {m.sender} <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginLeft: "6px" }}>({m.role})</span>
                                        </h4>
                                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{m.time}</span>
                                    </div>

                                    {/* Render message content (Intentionally Vulnerable for XSS Demonstration) */}
                                    <p
                                        style={{ margin: 0, color: "#334155", fontSize: "14px", lineHeight: "1.5" }}
                                        dangerouslySetInnerHTML={{ __html: m.text }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Send Message Input Form */}
                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "12px" }}>
                        <input
                            type="text"
                            placeholder="Type a message or announcement to the team..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "12px 18px",
                                border: "1.5px solid #cbd5e1",
                                borderRadius: "10px",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "10px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <FaPaperPlane /> Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Messages;
