import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById } from "../../services/labApi";
import { FaArrowLeft, FaUser, FaBuilding, FaEnvelope, FaPhone, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
import "./EmployeeProfile.css";

function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchEmployee(id);
        }
    }, [id]);

    const fetchEmployee = async (empId) => {
        setLoading(true);
        setError("");
        try {
            const res = await getEmployeeById(empId);
            setEmployee(res.data);
        } catch (err) {
            console.error("Error fetching employee profile:", err);
            setError(err.response?.data?.message || "Employee not found");
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <button
                    className="back-btn"
                    onClick={() => navigate("/lab/employees")}
                >
                    <FaArrowLeft /> Back to Employees
                </button>

                {loading ? (
                    <div className="profile-card" style={{ textAlign: "center", padding: "60px" }}>
                        <h2 style={{ color: "#0f172a" }}>Loading Employee Profile...</h2>
                    </div>
                ) : error || !employee ? (
                    <div className="profile-error">
                        <h2>Employee Not Found</h2>
                        <p style={{ color: "#64748b" }}>No employee record matching ID <strong>{id}</strong>.</p>
                    </div>
                ) : (
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {(employee.name || employee.fullName || "E").charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-header-info">
                                <h1>{employee.name || employee.fullName}</h1>
                                <p>{employee.role || "Employee"} • {employee.department || employee.dept || "HR"}</p>
                            </div>
                        </div>

                        <div className="profile-details-grid">
                            <div className="profile-field">
                                <label><FaUser style={{ marginRight: "6px" }} /> Name</label>
                                <span>{employee.name || employee.fullName}</span>
                            </div>

                            <div className="profile-field">
                                <label><FaBuilding style={{ marginRight: "6px" }} /> Department</label>
                                <span>{employee.department || employee.dept || "HR"}</span>
                            </div>

                            <div className="profile-field">
                                <label><FaEnvelope style={{ marginRight: "6px" }} /> Email</label>
                                <span style={{ color: "#2563eb" }}>{employee.email}</span>
                            </div>

                            <div className="profile-field">
                                <label><FaPhone style={{ marginRight: "6px" }} /> Phone</label>
                                <span>{employee.phone || "9876543210"}</span>
                            </div>

                            <div className="profile-field highlight">
                                <label><FaDollarSign style={{ marginRight: "6px" }} /> Salary</label>
                                <span>{employee.salary ? String(employee.salary).replace("$", "₹") : "₹8,50,000"}</span>
                            </div>

                            <div className="profile-field highlight">
                                <label><FaMapMarkerAlt style={{ marginRight: "6px" }} /> Address</label>
                                <span>{employee.address || employee.location || "New York"}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeProfile;