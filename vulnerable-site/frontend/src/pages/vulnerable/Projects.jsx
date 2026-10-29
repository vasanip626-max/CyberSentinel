import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { FaProjectDiagram, FaPlus, FaFolderOpen, FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import "./Dashboard.css";

function Projects() {
    const [projects, setProjects] = useState([
        { id: 1, name: "Cloud Migration Phase 2", category: "Infrastructure", progress: 85, status: "In Progress", lead: "Arjun Mehta", deadline: "2026-08-15" },
        { id: 2, name: "NovaSoft Payment Gateway", category: "Fintech", progress: 100, status: "Completed", lead: "Priya Patel", deadline: "2026-07-20" },
        { id: 3, name: "Employee Mobile App (iOS)", category: "Mobile", progress: 60, status: "In Progress", lead: "Rahul Sharma", deadline: "2026-09-01" },
        { id: 4, name: "Cyber Security Audit", category: "Security", progress: 40, status: "Under Review", lead: "John Smith", deadline: "2026-08-30" },
        { id: 5, name: "HR Payroll Automation", category: "Internal Tools", progress: 100, status: "Completed", lead: "Emily Johnson", deadline: "2026-06-30" }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("Engineering");
    const [newLead, setNewLead] = useState("");

    const handleAddProject = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const newProj = {
            id: Date.now(),
            name: newName,
            category: newCategory,
            progress: 10,
            status: "In Progress",
            lead: newLead || "Current User",
            deadline: "2026-10-15"
        };

        setProjects([newProj, ...projects]);
        setNewName("");
        setNewLead("");
        setShowModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="welcome-banner">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div>
                            <h1>Projects Management</h1>
                            <p>Track, manage, and deploy NovaSoft engineering projects.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                            }}
                        >
                            <FaPlus /> Create New Project
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaFolderOpen />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>{projects.length}</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Projects</span>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaCheckCircle />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>{projects.filter(p => p.status === "Completed").length}</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Completed</span>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            <FaClock />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "24px", color: "#0f172a", margin: 0 }}>{projects.filter(p => p.status === "In Progress").length}</h3>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>In Progress</span>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="dashboard-card">
                    <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaProjectDiagram style={{ color: "#2563eb" }} /> Active Projects List
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                        {projects.map((p) => (
                            <div key={p.id} style={{
                                background: "#f8fafc",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <h3 style={{ fontSize: "17px", color: "#0f172a", margin: 0, fontWeight: "700" }}>{p.name}</h3>
                                        <span style={{
                                            fontSize: "11px",
                                            fontWeight: "700",
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            background: p.status === "Completed" ? "#dcfce7" : p.status === "In Progress" ? "#dbeafe" : "#fef3c7",
                                            color: p.status === "Completed" ? "#15803d" : p.status === "In Progress" ? "#1e40af" : "#b45309"
                                        }}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0", fontWeight: "500" }}>
                                        Category: <strong>{p.category}</strong> • Lead: <strong>{p.lead}</strong>
                                    </p>
                                </div>

                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                                        <span>Progress</span>
                                        <span>{p.progress}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ width: `${p.progress}%`, height: "100%", background: p.progress === 100 ? "#16a34a" : "#2563eb", borderRadius: "10px", transition: "width 0.4s ease" }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "420px", maxWidth: "90%" }}>
                        <h2 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Create New Project</h2>
                        <form onSubmit={handleAddProject}>
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Project Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter project name..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                />
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Category</label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Security">Security</option>
                                    <option value="Fintech">Fintech</option>
                                    <option value="Mobile">Mobile</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Project Lead</label>
                                <input
                                    type="text"
                                    placeholder="Project lead name..."
                                    value={newLead}
                                    onChange={(e) => setNewLead(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none" }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px 18px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                                <button type="submit" style={{ padding: "10px 18px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Save Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;
