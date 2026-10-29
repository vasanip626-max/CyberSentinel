import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaRocket, FaLock, FaExclamationTriangle,
    FaDatabase, FaUsers, FaChartLine,
    FaShieldAlt, FaEye, FaCog, FaBell,
    FaPlay, FaCheck, FaTrash, FaSignOutAlt,
    FaUserCheck, FaUserSlash, FaTimes
} from "react-icons/fa";
import { labGetUsers, getEmployees } from "../../services/labApi";
import "./Admin.css";

const INITIAL_USERS = [
    { id: "USR001", name: "Aarav Shah", email: "aarav@novasoft.io", role: "Admin", plan: "Enterprise", status: "Active", salary: "₹18,50,000" },
    { id: "USR002", name: "Meera Kapoor", email: "meera@novasoft.io", role: "Member", plan: "Pro", status: "Active", salary: "₹12,00,000" },
    { id: "USR003", name: "Rohan Verma", email: "rohan@clover.dev", role: "Member", plan: "Pro", status: "Active", salary: "₹10,50,000" },
];

const INITIAL_LOGS = [
    { id: "LOG001", user: "aarav@novasoft.io", action: "Deployed v2.4.1", ip: "103.21.58.12", time: "2026-10-26 14:15", status: "Success" },
    { id: "LOG002", user: "meera@novasoft.io", action: "Login attempt", ip: "192.168.1.104", time: "2026-10-26 13:50", status: "Success" },
    { id: "LOG003", user: "attacker@dark.net", action: "SQL Injection attempt", ip: "45.33.32.156", time: "2026-10-26 13:22", status: "Blocked" },
    { id: "LOG004", user: "rohan@clover.dev", action: "API key generated", ip: "103.21.59.44", time: "2026-10-26 12:45", status: "Success" },
    { id: "LOG005", user: "unknown", action: "Brute force attempt", ip: "198.51.100.45", time: "2026-10-26 11:30", status: "Blocked" },
];

function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [users, setUsers] = useState(INITIAL_USERS);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [selectedUser, setSelectedUser] = useState(null);

    // Database Console State
    const [sqlQuery, setSqlQuery] = useState("SELECT * FROM employees WHERE status = 'Active'");
    const [queryResults, setQueryResults] = useState(null);
    const [queryLoading, setQueryLoading] = useState(false);

    // Settings State
    const [platformName, setPlatformName] = useState("NovaSoft Enterprise");
    const [adminEmail, setAdminEmail] = useState("admin@gmail.com");
    const [maxUsers, setMaxUsers] = useState("50000");
    const [sessionTimeout, setSessionTimeout] = useState("3600");
    const [savedNotice, setSavedNotice] = useState(false);

    // Security Rules State
    const [wafEnabled, setWafEnabled] = useState(false);
    const [strictAuth, setStrictAuth] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("lab_user") || "{}");

    useEffect(() => {
        // Fetch MongoDB Users
        labGetUsers()
            .then(res => {
                if (res.data?.users && res.data.users.length > 0) {
                    const mapped = res.data.users.map((u, i) => ({
                        id: `USR${String(i + 1).padStart(3, '0')}`,
                        name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
                        email: u.email,
                        role: u.role || (u.email === "admin@gmail.com" ? "Admin" : "Member"),
                        plan: u.plan || "Starter",
                        status: u.status || "Active",
                        salary: u.salary || "₹8,50,000"
                    }));
                    setUsers(mapped);
                }
            })
            .catch(() => {
                // Fallback to employee list
                getEmployees().then(res => {
                    if (res.data && res.data.length > 0) {
                        const mapped = res.data.map((u, i) => ({
                            id: `USR${String(i + 1).padStart(3, '0')}`,
                            name: u.name || u.fullName,
                            email: u.email,
                            role: u.role || "Member",
                            plan: "Enterprise",
                            status: u.status || "Active",
                            salary: u.salary || "₹8,50,000"
                        }));
                        setUsers(mapped);
                    }
                }).catch(err => console.log(err));
            });
    }, []);

    const handleRunQuery = async () => {
        setQueryLoading(true);
        try {
            // Fetch live employees data as simulated SQL result
            const res = await getEmployees();
            let data = res.data || [];

            // If query has WHERE filter simulation
            if (sqlQuery.toLowerCase().includes("id = '1'") || sqlQuery.toLowerCase().includes("id=1")) {
                data = data.slice(0, 1);
            } else if (sqlQuery.toLowerCase().includes("limit")) {
                data = data.slice(0, 3);
            }

            setQueryResults(data);

            // If SQL Injection detected in query, notify CyberSentinel
            const sqliKeywords = ["'", "or ", "union", "select", "--", ";", "1=1"];
            if (sqliKeywords.some(kw => sqlQuery.toLowerCase().includes(kw))) {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("attack_detected"));
                }
            }
        } catch (err) {
            console.error("SQL query simulation failed:", err);
            setQueryResults([]);
        } finally {
            setQueryLoading(false);
        }
    };

    const handleToggleStatus = (userId) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                const nextStatus = u.status === "Active" ? "Suspended" : "Active";
                return { ...u, status: nextStatus };
            }
            return u;
        }));
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(prev => ({
                ...prev,
                status: prev.status === "Active" ? "Suspended" : "Active"
            }));
        }
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("lab_user");
        localStorage.removeItem("lab_token");
        navigate("/lab/login");
    };

    const stats = [
        { label: "Total Users", value: `${users.length * 128 + 1042}`, icon: <FaUsers />, color: "#6366f1" },
        { label: "Active Projects", value: "38", icon: <FaChartLine />, color: "#22c55e" },
        { label: "Database Records", value: `${users.length} Live`, icon: <FaDatabase />, color: "#f59e0b" },
        { label: "Security Signals", value: `${logs.length}`, icon: <FaExclamationTriangle />, color: "#ef4444" },
    ];

    const navItems = [
        { key: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
        { key: "users", label: "User Management", icon: <FaUsers /> },
        { key: "logs", label: "Audit Logs", icon: <FaBell /> },
        { key: "database", label: "Database Console", icon: <FaDatabase /> },
        { key: "security", label: "Security Controls", icon: <FaLock /> },
        { key: "settings", label: "Platform Settings", icon: <FaCog /> },
    ];

    return (
        <div className="vadmin-page">
            <div className="vadmin-blob vablob1"></div>
            <div className="vadmin-blob vablob2"></div>
            <div className="vadmin-grid"></div>

            {/* Top Navigation */}
            <header className="vadmin-nav">
                <div className="vadmin-logo">
                    <div className="vadmin-logo-icon"><FaRocket /></div>
                    <div>
                        <span>NovaSoft</span>
                        <small>Administrator Control Center</small>
                    </div>
                </div>
                <div className="vadmin-nav-right">
                    <div className="vadmin-warning">
                        <FaShieldAlt /> Administrator Authenticated
                    </div>
                    <Link to="/lab/dashboard" className="vadmin-back-btn">User View</Link>
                    <button onClick={handleLogout} className="vadmin-back-btn" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </header>

            <div className="vadmin-layout">
                {/* Admin Sidebar */}
                <aside className="vadmin-sidebar">
                    <div className="vadmin-profile">
                        <div className="vadmin-profile-icon"><FaShieldAlt /></div>
                        <div>
                            <p>{currentUser.fullName || "System Admin"}</p>
                            <small>{currentUser.email || "admin@gmail.com"}</small>
                        </div>
                    </div>
                    <nav className="vadmin-sidenav">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                className={`vadmin-navbtn ${activeTab === item.key ? "va-active" : ""}`}
                                onClick={() => setActiveTab(item.key)}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="vadmin-main">

                    {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
                    {activeTab === "dashboard" && (
                        <>
                            <div className="vadmin-page-title">
                                <h2>Executive Administrator Dashboard</h2>
                                <p>System overview, live metrics, and real-time operational status</p>
                            </div>

                            <div className="vadmin-stats">
                                {stats.map((s, i) => (
                                    <div key={i} className="vadmin-stat-card" style={{ "--c": s.color }}>
                                        <div className="vadmin-stat-icon">{s.icon}</div>
                                        <div>
                                            <h3>{s.value}</h3>
                                            <p>{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="vadmin-recent">
                                <h3>Recent Administrative Activity</h3>
                                <table className="vadmin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th><th>User</th><th>Action</th><th>IP Address</th><th>Status</th><th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.slice(0, 4).map(l => (
                                            <tr key={l.id}>
                                                <td>{l.id}</td>
                                                <td>{l.user}</td>
                                                <td><strong>{l.action}</strong></td>
                                                <td><code>{l.ip}</code></td>
                                                <td>
                                                    <span className={`vadmin-badge badge-${l.status.toLowerCase()}`}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                                <td>{l.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* ── TAB 2: USER MANAGEMENT ── */}
                    {activeTab === "users" && (
                        <>
                            <div className="vadmin-page-title">
                                <h2>User Management & Access Control</h2>
                                <p>Manage accounts, grant roles, and review privileges ({users.length} active users)</p>
                            </div>

                            <table className="vadmin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Salary Tier</th><th>Status</th><th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`vadmin-role-badge ${u.role === "Admin" ? "role-admin" : "role-user"}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>{u.salary}</td>
                                            <td>
                                                <span className={`vadmin-badge badge-${u.status.toLowerCase()}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button className="vadmin-view-btn" onClick={() => setSelectedUser(u)}>
                                                        <FaEye /> Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(u.id)}
                                                        className="vadmin-view-btn"
                                                        style={{
                                                            background: u.status === "Active" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
                                                            color: u.status === "Active" ? "#ef4444" : "#22c55e"
                                                        }}
                                                    >
                                                        {u.status === "Active" ? <FaUserSlash /> : <FaUserCheck />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* ── TAB 3: AUDIT LOGS ── */}
                    {activeTab === "logs" && (
                        <>
                            <div className="vadmin-page-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2>Security & Audit Trail</h2>
                                    <p>Detailed chronological log of system actions, authentication events, and API calls</p>
                                </div>
                                <button
                                    onClick={() => setLogs([])}
                                    className="vadmin-view-btn"
                                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
                                >
                                    <FaTrash /> Clear Logs
                                </button>
                            </div>

                            <table className="vadmin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>User</th><th>Action Event</th><th>Source IP</th><th>Status</th><th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(l => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td>{l.user}</td>
                                            <td><strong>{l.action}</strong></td>
                                            <td><code>{l.ip}</code></td>
                                            <td>
                                                <span className={`vadmin-badge badge-${l.status.toLowerCase()}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td>{l.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* ── TAB 4: DATABASE CONSOLE ── */}
                    {activeTab === "database" && (
                        <>
                            <div className="vadmin-page-title">
                                <h2>Database Query Console</h2>
                                <p>Execute raw database queries directly against the NovaSoft employee database</p>
                            </div>

                            <div className="vadmin-db-box">
                                <label>SQL / MongoDB Query String</label>
                                <textarea
                                    className="vadmin-sql-input"
                                    rows={4}
                                    value={sqlQuery}
                                    onChange={(e) => setSqlQuery(e.target.value)}
                                />
                                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                    <button className="vadmin-run-btn" onClick={handleRunQuery} disabled={queryLoading}>
                                        <FaPlay /> {queryLoading ? "Executing Query..." : "Run Query"}
                                    </button>
                                    <button
                                        className="vadmin-view-btn"
                                        onClick={() => setSqlQuery("SELECT * FROM employees WHERE name = '' OR '1'='1'")}
                                    >
                                        Insert SQLi Payload (' OR '1'='1)
                                    </button>
                                </div>

                                {queryResults && (
                                    <div style={{ marginTop: "24px" }}>
                                        <h4 style={{ color: "#e2e8f0", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                                            <span>Query Output ({queryResults.length} records returned)</span>
                                            <span style={{ color: "#22c55e", fontSize: "13px" }}>✓ Query Execution OK (0.02s)</span>
                                        </h4>
                                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                            <table className="vadmin-table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Email</th><th>Salary</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {queryResults.map((row, idx) => (
                                                        <tr key={idx}>
                                                            <td>{row.id || idx + 1}</td>
                                                            <td>{row.name || row.fullName}</td>
                                                            <td>{row.role || "Staff"}</td>
                                                            <td>{row.department || row.dept || "Engineering"}</td>
                                                            <td>{row.email}</td>
                                                            <td style={{ color: "#6366f1", fontWeight: "700" }}>{row.salary || "₹8,50,000"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── TAB 5: SECURITY CONTROLS ── */}
                    {activeTab === "security" && (
                        <>
                            <div className="vadmin-page-title">
                                <h2>Security Policy Controls</h2>
                                <p>Review active vulnerability surfaces and toggle firewall protection</p>
                            </div>

                            <div style={{ background: "var(--card)", padding: "20px", borderRadius: "14px", border: "1px solid var(--border)", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <strong style={{ color: "white", display: "block" }}>Web Application Firewall (WAF) Inspection</strong>
                                        <small style={{ color: "var(--muted)" }}>Inspect and block SQLi / XSS pattern keywords</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={wafEnabled}
                                        onChange={() => setWafEnabled(!wafEnabled)}
                                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                    />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <strong style={{ color: "white", display: "block" }}>Strict Object-Level Authorization (IDOR Shield)</strong>
                                        <small style={{ color: "var(--muted)" }}>Verify session ownership before returning employee profile records</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={strictAuth}
                                        onChange={() => setStrictAuth(!strictAuth)}
                                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                    />
                                </div>
                            </div>

                            <div className="vadmin-vuln-list">
                                {[
                                    { name: "Insecure Direct Object Reference (IDOR)", severity: "High", desc: "User identity in session headers is compared against target record owner in /lab/employee/:id." },
                                    { name: "SQL Injection (SQLi)", severity: "Critical", desc: "Query parameter 'q' in employee search is evaluated for SQL bypass metacharacters." },
                                    { name: "Reflected Cross-Site Scripting (XSS)", severity: "High", desc: "Unescaped search terms reflected directly in the directory DOM tree." },
                                    { name: "Credential Brute Force", severity: "High", desc: "Consecutive failed login counter triggers attack threshold after 3 attempts." },
                                    { name: "Cross-Site Request Forgery (CSRF)", severity: "Medium", desc: "State-changing password update endpoint lacks cryptographic token check." }
                                ].map((v, i) => (
                                    <div key={i} className={`vadmin-vuln-card vuln-${v.severity.toLowerCase()}`}>
                                        <div className={`vadmin-vuln-badge severity-${v.severity.toLowerCase()}`}>{v.severity}</div>
                                        <div>
                                            <strong>{v.name}</strong>
                                            <p>{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── TAB 6: SETTINGS ── */}
                    {activeTab === "settings" && (
                        <>
                            <div className="vadmin-page-title">
                                <h2>Enterprise Platform Settings</h2>
                                <p>Manage NovaSoft global instance variables and administrative thresholds</p>
                            </div>

                            {savedNotice && (
                                <div style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "14px 20px", borderRadius: "10px", marginBottom: "20px", border: "1px solid rgba(34,197,94,0.3)" }}>
                                    ✓ Administrative platform settings saved successfully!
                                </div>
                            )}

                            <form onSubmit={handleSaveSettings} className="vadmin-settings-grid">
                                <div className="vadmin-setting-field">
                                    <label>Platform Name</label>
                                    <input
                                        type="text"
                                        value={platformName}
                                        onChange={(e) => setPlatformName(e.target.value)}
                                        className="vadmin-setting-input"
                                    />
                                </div>
                                <div className="vadmin-setting-field">
                                    <label>Master Admin Email</label>
                                    <input
                                        type="email"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        className="vadmin-setting-input"
                                    />
                                </div>
                                <div className="vadmin-setting-field">
                                    <label>Max Organization Users</label>
                                    <input
                                        type="number"
                                        value={maxUsers}
                                        onChange={(e) => setMaxUsers(e.target.value)}
                                        className="vadmin-setting-input"
                                    />
                                </div>
                                <div className="vadmin-setting-field">
                                    <label>Session Expiration Timeout (seconds)</label>
                                    <input
                                        type="number"
                                        value={sessionTimeout}
                                        onChange={(e) => setSessionTimeout(e.target.value)}
                                        className="vadmin-setting-input"
                                    />
                                </div>

                                <button type="submit" className="vadmin-save-btn">
                                    <FaCheck /> Save Administrator Configuration
                                </button>
                            </form>
                        </>
                    )}
                </main>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "#1e293b", border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: "16px", padding: "28px", width: "450px", maxWidth: "90%",
                        color: "white", boxShadow: "0 25px 60px rgba(0,0,0,0.6)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                            <h3 style={{ margin: 0, color: "#6366f1" }}>User Account Profile</h3>
                            <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>
                                <FaTimes />
                            </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                            <div><strong>User ID:</strong> {selectedUser.id}</div>
                            <div><strong>Full Name:</strong> {selectedUser.name}</div>
                            <div><strong>Email:</strong> {selectedUser.email}</div>
                            <div><strong>System Role:</strong> {selectedUser.role}</div>
                            <div><strong>Salary Tier:</strong> {selectedUser.salary}</div>
                            <div>
                                <strong>Status:</strong>{" "}
                                <span className={`vadmin-badge badge-${selectedUser.status.toLowerCase()}`}>
                                    {selectedUser.status}
                                </span>
                            </div>
                        </div>
                        <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => handleToggleStatus(selectedUser.id)}
                                style={{
                                    flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                                    background: selectedUser.status === "Active" ? "#ef4444" : "#22c55e",
                                    color: "white", fontWeight: "700", cursor: "pointer"
                                }}
                            >
                                {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    padding: "10px 18px", borderRadius: "8px", border: "1px solid #475569",
                                    background: "transparent", color: "#cbd5e1", cursor: "pointer"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
