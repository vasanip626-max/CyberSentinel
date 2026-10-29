import React from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { FaChartBar, FaFileDownload, FaChartLine, FaUsers, FaDollarSign } from "react-icons/fa";
import "./Dashboard.css";

function Reports() {
    const reportData = [
        { id: "REP-2026-01", title: "Q2 Financial Audit & Revenue Report", date: "2026-07-01", department: "Finance", author: "Emily Johnson", status: "Approved" },
        { id: "REP-2026-02", title: "NovaSoft Security Incident Log Summary", date: "2026-07-15", department: "IT Security", author: "Arjun Mehta", status: "Active" },
        { id: "REP-2026-03", title: "HR Employee Performance Review 2026", date: "2026-07-20", department: "Human Resources", author: "John Smith", status: "Approved" },
        { id: "REP-2026-04", title: "Infrastructure Uptime & Cloud Scaling Metrics", date: "2026-07-25", department: "Operations", author: "Rahul Sharma", status: "Approved" }
    ];

    const handleDownload = (title) => {
        alert(`Downloading ${title}... (Export complete)`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="welcome-banner">
                    <h1>Reports & Analytics</h1>
                    <p>Generate, review, and export NovaSoft corporate analytics reports.</p>
                </div>

                {/* Metrics Overview */}
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaDollarSign />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>₹48.5L</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Quarterly Revenue</span>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaChartLine />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>+18.4%</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>YoY Growth Rate</span>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaUsers />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>99.9%</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Service Uptime SLA</span>
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="dashboard-card">
                    <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaChartBar style={{ color: "#2563eb" }} /> Executive Reports Directory
                    </h2>

                    <table className="employee-table2">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Title</th>
                                <th>Department</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((r) => (
                                <tr key={r.id}>
                                    <td style={{ color: "#2563eb", fontWeight: "700" }}>{r.id}</td>
                                    <td style={{ color: "#0f172a", fontWeight: "700" }}>{r.title}</td>
                                    <td style={{ color: "#334155", fontWeight: "600" }}>{r.department}</td>
                                    <td style={{ color: "#475569" }}>{r.author}</td>
                                    <td style={{ color: "#64748b" }}>{r.date}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDownload(r.title)}
                                            style={{
                                                background: "#2563eb",
                                                color: "white",
                                                border: "none",
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}
                                        >
                                            <FaFileDownload /> Export PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Reports;
