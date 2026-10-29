import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { getEmployees } from "../../services/labApi";
import { FaSearch, FaUserCheck, FaEye, FaUserSlash } from "react-icons/fa";
import "./Dashboard.css";

function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadEmployees(search);
        }, 250);
        return () => clearTimeout(timer);
    }, [search]);

    const loadEmployees = async (searchTerm = "") => {
        setLoading(true);
        try {
            const res = await getEmployees(searchTerm);
            setEmployees(res.data || []);
        } catch (error) {
            console.log("Error loading employees:", error);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees;

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="welcome-banner">
                    <h1>Employees</h1>
                    <p>Search and manage NovaSoft employees.</p>
                </div>

                <div className="dashboard-card">
                    <h2>Employee Search</h2>
                    <div className="employee-search-box">
                        <FaSearch className="employee-search-icon" />
                        <input
                            type="text"
                            placeholder="Type employee name, department, or email..."
                            className="employee-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="dashboard-card">
                    {loading ? (
                        <div className="emp-empty-state">
                            <p>Loading employees...</p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="emp-empty-state">
                            <FaUserSlash />
                            <p>No employee found matching "<strong>{search}</strong>".</p>
                        </div>
                    ) : (
                        <table className="employee-table2">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, index) => (
                                    <tr key={index}>
                                        <td style={{ color: "#0f172a", fontWeight: "700" }}>
                                            {emp.name || emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()}
                                        </td>
                                        <td style={{ color: "#334155", fontWeight: "600" }}>
                                            {emp.department || emp.dept || emp.company || "Engineering"}
                                        </td>
                                        <td style={{ color: "#2563eb", fontWeight: "600" }}>
                                            {emp.email}
                                        </td>
                                        <td>
                                            <span className={`emp-status-badge ${emp.status?.toLowerCase() === "active" || emp.status?.toLowerCase() === "online" ? "active" : "inactive"}`}>
                                                <FaUserCheck style={{ marginRight: "6px", verticalAlign: "middle" }} />
                                                {emp.status || "Online"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => navigate(`/lab/employee/${emp.id || index + 1}`)}
                                            >
                                                <FaEye style={{ marginRight: "5px" }} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Employees;