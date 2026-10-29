import React, { useState, useEffect, useRef } from "react";
import {
    FaRobot,
    FaShieldAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaSearch,
    FaSpinner,
    FaLightbulb
} from "react-icons/fa";
import { analyzeThreatWithAI } from "../services/aiService";

function AIRecommendation({ latestAttack }) {
    const [selectedType, setSelectedType] = useState("idor");
    const [customQuery, setCustomQuery]   = useState("");
    const [loading, setLoading]           = useState(false);
    const [aiResult, setAiResult]         = useState(null);

    const lastAnalyzedKey   = useRef("");
    const userManuallyPicked = useRef(false);

    const runAnalysis = async (typeKey = null, queryText = "") => {
        setLoading(true);
        try {
            const res = await analyzeThreatWithAI({
                attack_type: typeKey,
                query: queryText
            });
            setAiResult(res.data);
        } catch (err) {
            console.log("AI Analysis error:", err);

            const q = (queryText || typeKey || "").toLowerCase();
            let title = "IDOR (Insecure Direct Object Reference) - High Vulnerability";
            let explanation = "IDOR occurs when an application exposes a reference to an internal object (such as employee ID /employee/2) in the URL without verifying if the logged-in user has permission to view that target resource.";
            let impact = "Unauthorized privilege escalation, exfiltration of sensitive employee salaries, addresses, and confidential records.";
            let recs = [
                "Enforce Server-Side Object-Level Authorization: Verify session identity against target record owner before returning data.",
                "Use Indirect Reference Maps or Cryptographic UUIDs instead of predictable sequential integer IDs (/employee/1 -> /employee/a8f9-4b1c).",
                "Log all unauthorized access attempts centrally to CyberSentinel for automated threat monitoring and firewall blocking."
            ];

            if (q.includes("sql") || q.includes("injection") || q.includes("'")) {
                title = "SQL Injection (SQLi) - Critical Vulnerability";
                explanation = "SQL Injection occurs when untrusted user input is concatenated directly into raw database queries, allowing attackers to bypass login authentication or extract database tables.";
                impact = "Authentication bypass, full database dumping, and unauthorized data modification.";
                recs = [
                    "Use Parameterized Queries / Prepared Statements (e.g. PyMongo parameterized filters).",
                    "Apply strict input sanitization and HTML entity encoding.",
                    "Deploy Web Application Firewall (WAF) inspection rules targeting SQL payload keywords."
                ];
            } else if (q.includes("xss") || q.includes("script") || q.includes("cross")) {
                title = "Cross-Site Scripting (XSS) - High Vulnerability";
                explanation = "Cross-Site Scripting (XSS) occurs when unescaped user input (such as script tags) is reflected back into web pages and executed in victim browser sessions.";
                impact = "Session hijacking via cookie theft, DOM manipulation, and credential harvesting.";
                recs = [
                    "Implement context-aware HTML entity encoding on dynamic user output.",
                    "Configure a strong Content Security Policy (CSP) header.",
                    "Set HttpOnly and Secure flags on authentication cookies."
                ];
            } else if (q.includes("brute") || q.includes("force") || q.includes("password")) {
                title = "Brute Force Authentication Attack";
                explanation = "Brute Force attacks systematically guess credential combinations against login forms until access is obtained.";
                impact = "Unauthorized account takeover and credential harvesting.";
                recs = [
                    "Implement Account Lockout policies after 3-5 failed attempts.",
                    "Enforce IP Rate Limiting on authentication endpoints.",
                    "Require Multi-Factor Authentication (MFA)."
                ];
            }

            setAiResult({
                title,
                explanation,
                potential_impact: impact,
                recommendations: recs
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only auto-update if the user hasn't manually locked a preset choice
        if (!userManuallyPicked.current) {
            if (latestAttack) {
                const attackKey = `${latestAttack.timestamp || ''}_${latestAttack.attack || latestAttack.attack_type || ''}_${latestAttack.actor_user || ''}`;
                if (lastAnalyzedKey.current !== attackKey) {
                    lastAnalyzedKey.current = attackKey;
                    const attackType = (latestAttack.attack || latestAttack.attack_type || "").toLowerCase();
                    if (attackType.includes("idor")) setSelectedType("idor");
                    else if (attackType.includes("sql")) setSelectedType("sqli");
                    else if (attackType.includes("xss")) setSelectedType("xss");
                    else if (attackType.includes("brute")) setSelectedType("brute_force");
                    runAnalysis(attackType, `How to prevent ${latestAttack.attack || "attack"} targeting ${latestAttack.target_user || "user"}`);
                }
            } else if (!lastAnalyzedKey.current) {
                lastAnalyzedKey.current = "initial_idor";
                runAnalysis("idor");
            }
        }
    }, [latestAttack]);

    const handleSelectPreset = (type) => {
        userManuallyPicked.current = true; // Lock user's explicit selection
        setSelectedType(type);
        setCustomQuery("");
        lastAnalyzedKey.current = `preset_${type}`;
        runAnalysis(type);
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customQuery.trim()) return;
        userManuallyPicked.current = true; // Lock user's custom query selection
        setSelectedType("custom");
        lastAnalyzedKey.current = `query_${customQuery}`;
        runAnalysis(null, customQuery);
    };

    return (
        <div className="ai-card" style={{ border: "1px solid rgba(0, 200, 255, 0.3)", borderRadius: "18px" }}>
            <div className="ai-header">
                <div className="ai-title">
                    <FaRobot className="ai-icon" style={{ color: "#00C8FF" }} />
                    <h2>AI Threat Prevention & Remediation Engine</h2>
                </div>
                <span className="ai-badge" style={{ background: "rgba(0, 255, 153, 0.15)", color: "#00FF99", border: "1px solid rgba(0, 255, 153, 0.3)" }}>
                    AI Guidance Active
                </span>
            </div>

            {/* Attack Presets */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {[
                    { key: "idor",        label: "IDOR Vulnerability" },
                    { key: "sqli",        label: "SQL Injection" },
                    { key: "xss",         label: "XSS Attack" },
                    { key: "brute_force", label: "Brute Force" }
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => handleSelectPreset(item.key)}
                        style={{
                            background: selectedType === item.key ? "linear-gradient(135deg, #00C8FF, #008CFF)" : "#21262D",
                            color: "white",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "0.2s"
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Custom AI Query Input Bar */}
            <form onSubmit={handleCustomSubmit} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <div style={{
                    flex: 1, display: "flex", alignItems: "center", gap: "8px",
                    background: "#161B22", border: "1px solid #30363D",
                    borderRadius: "10px", padding: "0 12px", height: "42px"
                }}>
                    <FaSearch style={{ color: "#00C8FF", fontSize: "14px" }} />
                    <input
                        type="text"
                        placeholder="Ask AI how to fix any attack (e.g. 'How to fix IDOR vulnerability in Python?')..."
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "13px" }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                        color: "white", border: "none", borderRadius: "10px",
                        padding: "0 18px", fontSize: "13px", fontWeight: "700",
                        cursor: "pointer"
                    }}
                >
                    {loading ? <FaSpinner className="fa-spin" /> : "Ask AI"}
                </button>
            </form>

            <div className="ai-content">
                {loading ? (
                    <div style={{ padding: "30px", textAlign: "center", color: "#8B949E" }}>
                        <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "#00C8FF", marginBottom: "10px" }} />
                        <p>AI Assistant is building step-by-step code remediation steps...</p>
                    </div>
                ) : (
                    aiResult && (
                        <>
                            <div className="analysis-box" style={{ background: "rgba(255, 77, 109, 0.1)", borderLeft: "4px solid #FF4D6D" }}>
                                <FaExclamationTriangle className="warning-icon" style={{ color: "#FF4D6D" }} />
                                <div>
                                    <h3 style={{ color: "#FF4D6D" }}>{aiResult.title || "AI Vulnerability Analysis"}</h3>
                                    <p style={{ marginTop: "6px", lineHeight: "1.6", color: "#C9D1D9" }}>{aiResult.explanation}</p>
                                    {aiResult.potential_impact && (
                                        <p style={{ marginTop: "8px", fontSize: "12px", color: "#FF4D6D" }}>
                                            <strong>Security Impact:</strong> {aiResult.potential_impact}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="recommendation-box" style={{ background: "rgba(0, 255, 153, 0.08)", borderLeft: "4px solid #00FF99", marginTop: "16px" }}>
                                <FaShieldAlt className="shield-icon" style={{ color: "#00FF99" }} />
                                <div>
                                    <h3 style={{ color: "#00FF99", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaLightbulb /> AI Code Remediation & Prevention Steps
                                    </h3>
                                    <ul style={{ marginTop: "10px" }}>
                                        {aiResult.recommendations?.map((rec, index) => (
                                            <li key={index} style={{ marginBottom: "8px", color: "#E2E8F0", lineHeight: "1.6" }}>
                                                <FaCheckCircle style={{ color: "#00FF99", marginRight: "8px" }} /> {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
}

export default AIRecommendation;