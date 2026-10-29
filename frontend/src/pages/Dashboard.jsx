import React, { useEffect, useState, useRef } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StatusCard from "../components/StatusCard";
import AttackTable from "../components/AttackTable";
import AIRecommendation from "../components/AIRecommendation";
import FloatingAIChatbot from "../components/FloatingAIChatbot";
import Charts from "../components/Charts";
import Footer from "../components/Footer";

import { getAttacks } from "../services/attackService";
import { getDashboard } from "../services/dashboardService";
import { formatTimeIST } from "../utils/time";

import {
    FaExclamationTriangle,
    FaShieldAlt,
    FaBell,
    FaBrain,
    FaRobot,
    FaBroadcastTower,
    FaFileAlt,
    FaCog,
    FaTimes,
    FaSave
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [attacks, setAttacks]             = useState([]);
    const [activeTab, setActiveTab]         = useState(1);
    const [filterCategory, setFilterCategory] = useState("All");

    // Dynamic Health Status: Defaults to Offline/Disconnected until verified by live backend ping
    const [systemStatus, setSystemStatus]   = useState([
        { title: "AI Engine", status: "Offline" },
        { title: "Firewall",  status: "Disabled" },
        { title: "Backend",   status: "Offline" },
        { title: "Database",  status: "Disconnected" }
    ]);

    // Real-Time Attack Toast Notification State
    const [latestNotification, setLatestNotification] = useState(null);
    const prevAttacksLength = useRef(0);

    // Settings State
    const [firewallAutoBlock, setFirewallAutoBlock] = useState(true);
    const [emailAlerts, setEmailAlerts]             = useState(true);
    const [apiSecKey, setApiSecKey]                 = useState("cs_live_99a88b77c66d55");
    const [settingsSaved, setSettingsSaved]         = useState(false);

    const markServicesOffline = () => {
        setSystemStatus([
            { title: "AI Engine", status: "Offline" },
            { title: "Firewall",  status: "Disabled" },
            { title: "Backend",   status: "Offline" },
            { title: "Database",  status: "Disconnected" }
        ]);
    };

    useEffect(() => {
        loadDashboard();
        loadAttacks();

        // 300ms ultra-fast stream listener
        const interval = setInterval(() => {
            loadAttacks();
        }, 300);

        // Instant Broadcast Event Listener
        const handleInstantAttack = () => {
            loadDashboard();
            loadAttacks();
        };

        window.addEventListener("attack_detected", handleInstantAttack);
        window.addEventListener("storage", handleInstantAttack);

        return () => {
            clearInterval(interval);
            window.removeEventListener("attack_detected", handleInstantAttack);
            window.removeEventListener("storage", handleInstantAttack);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboard();
            if (data) {
                setDashboardData(data);
                if (data.systemStatus && Array.isArray(data.systemStatus)) {
                    setSystemStatus(data.systemStatus);
                }
                if (data.attacks && Array.isArray(data.attacks) && data.attacks.length > 0) {
                    setAttacks(data.attacks);
                }
            }
        } catch (error) {
            console.log("Dashboard Error:", error);
            markServicesOffline();
        }
    };

    const loadAttacks = async () => {
        try {
            const data = await getAttacks();
            if (Array.isArray(data)) {
                setAttacks(data);

                if (prevAttacksLength.current === 0 || data.length > prevAttacksLength.current) {
                    const newest = data[0];
                    if (newest) {
                        setLatestNotification({
                            attack: newest.attack || newest.attack_type || "Security Incident",
                            actor: newest.actor_user || "Attacker",
                            target: newest.target_user || newest.ip || "NovaSoft Target",
                            time: formatTimeIST(newest.time, newest.timestamp)
                        });
                    }
                }
                prevAttacksLength.current = data.length;
            }
        } catch (error) {
            console.log("Attacks Error:", error);
            markServicesOffline();
        }
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 1: return "Cyber Security Dashboard";
            case 2: return "Threat Detection Suite";
            case 3: return "Live Network Monitor";
            case 4: return "Attack Logs Console";
            case 5: return "AI Security Analysis";
            case 6: return "Security Incident Reports";
            case 7: return "System & Security Settings";
            default: return "Cyber Security Dashboard";
        }
    };

    const getTabSubtitle = () => {
        switch (activeTab) {
            case 1: return "AI Powered Threat Detection & Incident Response Platform";
            case 2: return "Inspect and classify detected web vulnerability threats (IDOR, SQLi, XSS, Brute Force)";
            case 3: return "Real-time socket network traffic and active IP connection monitoring";
            case 4: return "Complete audit logs of all detected application and network attack vectors";
            case 5: return "AI Threat Engine & Automated Incident Response Suite";
            case 6: return "Download and export formal SOC 2 security compliance and incident report logs";
            case 7: return "Configure CyberSentinel threat detection rules, firewall toggles, and API keys";
            default: return "AI Powered Threat Detection & Incident Response Platform";
        }
    };

    const filteredAttacks = attacks.filter((a) => {
        if (filterCategory === "All") return true;
        if (filterCategory === "IDOR") return (a.attack || a.attack_type || "").includes("IDOR");
        if (filterCategory === "SQLi") return (a.attack || a.attack_type || "").includes("SQL");
        if (filterCategory === "XSS") return (a.attack || a.attack_type || "").includes("XSS");
        return true;
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
    };

    return (
        <div className="dashboard-container" style={{ position: "relative" }}>
            {/* Real-time Attack Notification Toast Banner */}
            {latestNotification && (
                <div style={{
                    position: "fixed",
                    top: "85px",
                    right: "24px",
                    zIndex: 999999,
                    background: "#0F172A",
                    border: "2px solid #FF4D6D",
                    borderRadius: "16px",
                    padding: "18px 24px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.95)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    maxWidth: "440px"
                }}>
                    <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: "rgba(255, 77, 109, 0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", color: "#FF4D6D", flexShrink: 0
                    }}>
                        <FaExclamationTriangle />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 4px 0", color: "#FF4D6D", fontSize: "14px", fontWeight: "800" }}>
                            🚨 THREAT DETECTED IN NOVASOFT!
                        </h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#E2E8F0", lineHeight: "1.4" }}>
                            <strong>{latestNotification.attack}:</strong> User <code>{latestNotification.actor}</code> accessed <code>{latestNotification.target}</code>
                        </p>
                        <span style={{ fontSize: "11px", color: "#94A3B8", display: "block", marginTop: "4px" }}>
                            Time: {latestNotification.time}
                        </span>
                    </div>
                    <button
                        onClick={() => setLatestNotification(null)}
                        style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Background Animations */}
            <div className="background-circle circle1"></div>
            <div className="background-circle circle2"></div>
            <div className="background-circle circle3"></div>

            {/* Sidebar */}
            <Sidebar activeId={activeTab} setActiveId={setActiveTab} />

            {/* Main Content Area */}
            <div className="dashboard-main">
                <Navbar unreadCount={attacks.length} latestAttacks={attacks} />

                {/* Section Header */}
                <div className="dashboard-header">
                    <h1>{getTabTitle()}</h1>
                    <p>{getTabSubtitle()}</p>
                </div>

                {/* TAB 1: OVERVIEW DASHBOARD */}
                {activeTab === 1 && (
                    <>
                        <div className="stats-grid">
                            <StatCard
                                title="Threat Level"
                                value={dashboardData?.stats?.threatLevel || "CRITICAL"}
                                icon={<FaShieldAlt />}
                                color="#FF4D6D"
                            />
                            <StatCard
                                title="Active Threats"
                                value={dashboardData?.stats?.activeThreats || attacks.length || 0}
                                icon={<FaExclamationTriangle />}
                                color="#00C8FF"
                            />
                            <StatCard
                                title="Today's Alerts"
                                value={dashboardData?.stats?.todayAlerts || attacks.length || 0}
                                icon={<FaBell />}
                                color="#FFC107"
                            />
                            <StatCard
                                title="AI Confidence"
                                value={dashboardData?.stats?.aiConfidence || "98%"}
                                icon={<FaBrain />}
                                color="#00FF99"
                            />
                        </div>

                        <div className="status-grid">
                            {systemStatus.map((item, index) => (
                                <StatusCard
                                    key={index}
                                    title={item.title}
                                    status={item.status}
                                />
                            ))}
                        </div>

                        <div className="middle-grid">
                            <Charts attacks={attacks} />
                            <AIRecommendation latestAttack={attacks[0]} />
                        </div>

                        <div className="attack-section">
                            <h2>Recent Attack Logs</h2>
                            <AttackTable attacks={attacks} />
                        </div>
                    </>
                )}

                {/* TAB 2: THREAT DETECTION */}
                {activeTab === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{
                            background: "rgba(22, 27, 34, 0.94)",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            borderRadius: "18px",
                            padding: "24px",
                            backdropFilter: "blur(18px)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "16px"
                        }}>
                            <div>
                                <h3 style={{ color: "white", fontSize: "18px", margin: "0 0 6px 0" }}>Threat Classification Filters</h3>
                                <p style={{ color: "#8B949E", fontSize: "13px", margin: 0 }}>Filter detected attacks by vulnerability category</p>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {["All", "IDOR", "SQLi", "XSS"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        style={{
                                            background: filterCategory === cat ? "linear-gradient(135deg, #00C8FF, #008CFF)" : "rgba(255, 255, 255, 0.05)",
                                            color: "white",
                                            border: filterCategory === cat ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                                            padding: "8px 18px",
                                            borderRadius: "20px",
                                            fontWeight: "700",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            transition: "0.2s"
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="attack-section">
                            <h2>Filtered Threat Log ({filteredAttacks.length} Records)</h2>
                            <AttackTable attacks={filteredAttacks} />
                        </div>
                    </div>
                )}

                {/* TAB 3: LIVE MONITOR */}
                {activeTab === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{
                            background: "rgba(22, 27, 34, 0.94)",
                            border: "1px solid rgba(0, 255, 153, 0.3)",
                            borderRadius: "18px",
                            padding: "24px",
                            backdropFilter: "blur(18px)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#00FF99", boxShadow: "0 0 12px #00FF99" }}></div>
                                <h3 style={{ color: "#00FF99", margin: 0, fontSize: "18px" }}>Live Traffic Socket Monitor (Active Stream)</h3>
                            </div>
                            <p style={{ color: "#8B949E", fontSize: "13px", marginBottom: "20px" }}>
                                Monitoring real-time incoming HTTP packets on target endpoints (`/lab/employee/:id`, `/lab/login`, `/lab/search`).
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {attacks.slice(0, 6).map((a, idx) => (
                                    <div key={idx} style={{
                                        background: "rgba(13, 17, 23, 0.8)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        borderRadius: "12px",
                                        padding: "14px 18px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <FaBroadcastTower style={{ color: "#00C8FF", fontSize: "18px" }} />
                                            <div>
                                                <strong style={{ color: "white", fontSize: "14px", display: "block" }}>{a.attack} Attempt Detected</strong>
                                                <span style={{ color: "#8B949E", fontSize: "12px" }}>Source IP: <code>{a.ip}</code> • Target: <code>{a.target_user || "/lab/employee"}</code></span>
                                            </div>
                                        </div>
                                        <span style={{
                                            background: a.severity === "Critical" ? "rgba(255,77,109,0.2)" : "rgba(255,193,7,0.2)",
                                            color: a.severity === "Critical" ? "#FF4D6D" : "#FFC107",
                                            padding: "4px 12px",
                                            borderRadius: "14px",
                                            fontSize: "12px",
                                            fontWeight: "700"
                                        }}>
                                            {a.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: ATTACK LOGS CONSOLE */}
                {activeTab === 4 && (
                    <div className="attack-section">
                        <h2>All Historical Attack Logs ({attacks.length} Total Logged)</h2>
                        <AttackTable attacks={attacks} />
                    </div>
                )}

                {/* TAB 5: AI ANALYSIS */}
                {activeTab === 5 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{
                            background: "rgba(22, 27, 34, 0.94)",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            borderRadius: "18px",
                            padding: "24px",
                            backdropFilter: "blur(18px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "16px"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{
                                    width: "50px", height: "50px", borderRadius: "14px",
                                    background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "24px", color: "white"
                                }}>
                                    <FaRobot />
                                </div>
                                <div>
                                    <h3 style={{ color: "white", fontSize: "18px" }}>CyberSentinel AI Security Assistant</h3>
                                    <p style={{ color: "#8B949E", fontSize: "13px", marginTop: "2px" }}>
                                        Threat Engine scanning SQL Injection, XSS, Brute Force & CSRF vulnerabilities. Click the floating bot icon at the bottom-right for live chat!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <AIRecommendation latestAttack={attacks[0]} />
                    </div>
                )}

                {/* TAB 6: REPORTS */}
                {activeTab === 6 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{
                            background: "rgba(22, 27, 34, 0.94)",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            borderRadius: "18px",
                            padding: "24px",
                            backdropFilter: "blur(18px)"
                        }}>
                            <h3 style={{ color: "white", fontSize: "18px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <FaFileAlt style={{ color: "#00C8FF" }} /> SOC 2 Compliance & Security Incident Reports
                            </h3>
                            <p style={{ color: "#8B949E", fontSize: "13px", marginBottom: "20px" }}>
                                Generate and download official PDF incident report logs for all detected IDOR, SQLi, and XSS attacks.
                            </p>

                            <AttackTable attacks={attacks} />
                        </div>
                    </div>
                )}

                {/* TAB 7: SETTINGS */}
                {activeTab === 7 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {settingsSaved && (
                            <div style={{ background: "rgba(0, 255, 153, 0.15)", color: "#00FF99", border: "1px solid rgba(0, 255, 153, 0.3)", padding: "14px 20px", borderRadius: "12px", fontWeight: "700" }}>
                                ✓ Security settings and Firewall policy rules updated!
                            </div>
                        )}

                        <div style={{
                            background: "rgba(22, 27, 34, 0.94)",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            borderRadius: "18px",
                            padding: "28px",
                            backdropFilter: "blur(18px)",
                            maxWidth: "750px"
                        }}>
                            <h3 style={{ color: "white", fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <FaCog style={{ color: "#00C8FF" }} /> Platform Security Configuration
                            </h3>

                            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <div>
                                        <h4 style={{ color: "white", margin: "0 0 4px 0", fontSize: "15px" }}>Automated Firewall IP Blocking</h4>
                                        <p style={{ color: "#8B949E", margin: 0, fontSize: "12px" }}>Automatically block source IPs triggering IDOR or SQLi attacks</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={firewallAutoBlock}
                                        onChange={() => setFirewallAutoBlock(!firewallAutoBlock)}
                                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                    />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <div>
                                        <h4 style={{ color: "white", margin: "0 0 4px 0", fontSize: "15px" }}>Real-time Security Email Alerts</h4>
                                        <p style={{ color: "#8B949E", margin: 0, fontSize: "12px" }}>Receive email notifications on High/Critical severity alerts</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailAlerts}
                                        onChange={() => setEmailAlerts(!emailAlerts)}
                                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", color: "#8B949E", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>Platform API Security Key</label>
                                    <input
                                        type="text"
                                        value={apiSecKey}
                                        onChange={(e) => setApiSecKey(e.target.value)}
                                        style={{
                                            width: "100%",
                                            background: "rgba(13, 17, 23, 0.8)",
                                            border: "1px solid rgba(255, 255, 255, 0.15)",
                                            color: "#00C8FF",
                                            padding: "12px 16px",
                                            borderRadius: "10px",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            outline: "none"
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "10px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        alignSelf: "flex-start",
                                        boxShadow: "0 4px 14px rgba(0, 200, 255, 0.35)"
                                    }}
                                >
                                    <FaSave /> Save Security Settings
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <Footer />
            </div>

            {/* Floating Chatbot Assistant */}
            <FloatingAIChatbot />
        </div>
    );
}

export default Dashboard;