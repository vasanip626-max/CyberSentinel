import React, { useState, useRef, useEffect } from "react";
import {
    FaRobot,
    FaPaperPlane,
    FaUser,
    FaShieldAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaCode,
    FaSpinner,
    FaLightbulb
} from "react-icons/fa";
import { sendAIChatMessage } from "../services/aiService";

function AIChatbot() {
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! I am your CyberSentinel AI Security Assistant. Ask me about any web attack (SQL Injection, XSS, Brute Force, CSRF, RCE, DDoS) to learn what it is, its potential outcomes, and how to overcome it!",
            breakdown: null
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (queryText = null) => {
        const textToSend = queryText || input;
        if (!textToSend.trim()) return;

        // Add user message
        const userMsg = { sender: "user", text: textToSend, breakdown: null };
        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInput("");
        setLoading(true);

        try {
            const res = await sendAIChatMessage(textToSend);
            const data = res.data;
            
            const aiMsg = {
                sender: "ai",
                text: data.ai_response_text || `Analysis complete for '${textToSend}'.`,
                breakdown: data
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.log("Chatbot error:", err);
            // Fallback response if offline
            const fallbackMsg = {
                sender: "ai",
                text: `Analysis breakdown for '${textToSend}':`,
                breakdown: {
                    attack_found: true,
                    attack_name: textToSend.toUpperCase().includes("XSS") ? "Cross-Site Scripting (XSS)" : "SQL Injection (SQLi)",
                    owasp: "OWASP Top 10 Security Risk",
                    severity: "Critical",
                    definition: "SQL Injection occurs when untrusted user input is directly concatenated into SQL database queries.",
                    mechanism: "An attacker passes SQL metacharacters (e.g. ' OR '1'='1) to alter query execution logic.",
                    outcomes: [
                        "Authentication bypass without credentials",
                        "Unauthorized extraction of user databases and passwords",
                        "Data tampering or administrative privilege escalation"
                    ],
                    how_to_overcome: [
                        "Use Parameterized Queries / Prepared Statements.",
                        "Sanitize and validate all user inputs.",
                        "Enforce Least Privilege database access.",
                        "Deploy a Web Application Firewall (WAF)."
                    ],
                    example_code: "cursor.execute('SELECT * FROM users WHERE email = %s', (email,))"
                }
            };
            setMessages((prev) => [...prev, fallbackMsg]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "What is SQL Injection?",
        "Explain XSS & how to prevent it",
        "How to stop Brute Force attacks?",
        "What is CSRF & its outcomes?",
        "Explain Remote Code Execution (RCE)"
    ];

    return (
        <div style={{
            background: "rgba(22, 27, 34, 0.94)",
            border: "1px solid rgba(0, 200, 255, 0.18)",
            borderRadius: "18px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            height: "650px",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 20px rgba(0,200,255,0.08)"
        }}>
            
            {/* Chatbot Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(0, 200, 255, 0.15)",
                marginBottom: "16px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "42px", height: "42px", borderRadius: "12px",
                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                        display: "flex", alignItems: "center", justifyCenter: "center",
                        fontSize: "20px", color: "white", padding: "10px"
                    }}>
                        <FaRobot />
                    </div>
                    <div>
                        <h3 style={{ color: "white", fontSize: "16px", margin: 0 }}>AI Security Assistant Chatbot</h3>
                        <span style={{ color: "#8B949E", fontSize: "12px" }}>Ask about web attacks, outcomes & remediation</span>
                    </div>
                </div>
                <span style={{
                    background: "rgba(0, 255, 153, 0.15)", color: "#00FF99",
                    border: "1px solid rgba(0, 255, 153, 0.3)",
                    padding: "4px 12px", borderRadius: "15px", fontSize: "11px", fontWeight: "600"
                }}>
                    Active SOC Bot
                </span>
            </div>

            {/* Quick Suggestion Chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {suggestions.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        style={{
                            background: "#21262D",
                            color: "#00C8FF",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            padding: "6px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            cursor: "pointer",
                            transition: "0.2s"
                        }}
                    >
                        💡 {s}
                    </button>
                ))}
            </div>

            {/* Chat History Area */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
            }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
                        }}
                    >
                        {msg.sender === "ai" && (
                            <div style={{
                                width: "34px", height: "34px", borderRadius: "50%",
                                background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, fontSize: "16px"
                            }}>
                                <FaRobot />
                            </div>
                        )}

                        <div style={{
                            maxWidth: "85%",
                            background: msg.sender === "user" ? "linear-gradient(135deg, #00C8FF, #008CFF)" : "#161B22",
                            color: "white",
                            padding: "14px 18px",
                            borderRadius: msg.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                            border: msg.sender === "ai" ? "1px solid #30363D" : "none",
                            fontSize: "14px",
                            lineHeight: "1.6"
                        }}>
                            {/* Standard message text */}
                            <p style={{ margin: 0 }}>{msg.text}</p>

                            {/* Rich Attack Breakdown Card if present */}
                            {msg.breakdown && msg.breakdown.attack_found && (
                                <div style={{
                                    marginTop: "14px",
                                    background: "#0D1117",
                                    border: "1px solid rgba(0, 200, 255, 0.25)",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px"
                                }}>
                                    {/* Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h4 style={{ color: "#00C8FF", margin: 0, fontSize: "15px" }}>
                                            🛡️ {msg.breakdown.attack_name}
                                        </h4>
                                        <span style={{
                                            background: msg.breakdown.severity === "Critical" ? "#FF4D6D22" : "#FFC10722",
                                            color: msg.breakdown.severity === "Critical" ? "#FF4D6D" : "#FFC107",
                                            border: `1px solid ${msg.breakdown.severity === "Critical" ? "#FF4D6D" : "#FFC107"}`,
                                            padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "700"
                                        }}>
                                            {msg.breakdown.severity} Severity ({msg.breakdown.owasp})
                                        </span>
                                    </div>

                                    {/* 1. What is this attack? */}
                                    <div>
                                        <strong style={{ color: "#00FF99", fontSize: "12px", textTransform: "uppercase" }}>
                                            📌 What is this Attack?
                                        </strong>
                                        <p style={{ color: "#C9D1D9", fontSize: "13px", marginTop: "4px", margin: 0 }}>
                                            {msg.breakdown.definition}
                                        </p>
                                    </div>

                                    {/* Mechanism */}
                                    {msg.breakdown.mechanism && (
                                        <div>
                                            <strong style={{ color: "#00C8FF", fontSize: "12px", textTransform: "uppercase" }}>
                                                ⚙️ How it Works (Mechanism)
                                            </strong>
                                            <p style={{ color: "#8B949E", fontSize: "13px", marginTop: "4px", margin: 0 }}>
                                                {msg.breakdown.mechanism}
                                            </p>
                                        </div>
                                    )}

                                    {/* 2. Potential Outcomes & Risks */}
                                    <div>
                                        <strong style={{ color: "#FF4D6D", fontSize: "12px", textTransform: "uppercase" }}>
                                            💥 Potential Outcomes & Risks
                                        </strong>
                                        <ul style={{ margin: "6px 0 0 18px", padding: 0, color: "#C9D1D9", fontSize: "12px" }}>
                                            {msg.breakdown.outcomes?.map((o, idx) => (
                                                <li key={idx} style={{ marginBottom: "4px" }}>{o}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* 3. How to Overcome / Mitigate */}
                                    <div>
                                        <strong style={{ color: "#00FF99", fontSize: "12px", textTransform: "uppercase" }}>
                                            🛡️ How to Overcome & Mitigate
                                        </strong>
                                        <ul style={{ margin: "6px 0 0 18px", padding: 0, color: "#C9D1D9", fontSize: "12px" }}>
                                            {msg.breakdown.how_to_overcome?.map((h, idx) => (
                                                <li key={idx} style={{ marginBottom: "4px" }}>
                                                    <FaCheckCircle style={{ color: "#00FF99", marginRight: "6px" }} />
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Code snippet example */}
                                    {msg.breakdown.example_code && (
                                        <div style={{ background: "#161B22", padding: "10px", borderRadius: "8px", border: "1px solid #30363D" }}>
                                            <strong style={{ color: "#8B949E", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <FaCode /> Remediation Code Concept:
                                            </strong>
                                            <pre style={{ color: "#00C8FF", fontSize: "11px", margin: "6px 0 0 0", fontFamily: "monospace", whitespace: "pre-wrap" }}>
                                                {msg.breakdown.example_code}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {msg.sender === "user" && (
                            <div style={{
                                width: "34px", height: "34px", borderRadius: "50%",
                                background: "#30363D", color: "#00C8FF",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, fontSize: "14px"
                            }}>
                                <FaUser />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "#8B949E", fontSize: "13px" }}>
                        <div style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                            color: "white", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <FaRobot />
                        </div>
                        <FaSpinner className="fa-spin" style={{ color: "#00C8FF" }} />
                        <span>AI Assistant is analyzing security vector...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{
                display: "flex", gap: "10px", marginTop: "16px", paddingTop: "16px",
                borderTop: "1px solid rgba(0, 200, 255, 0.15)"
            }}>
                <input
                    type="text"
                    placeholder="Ask AI about any attack (e.g., 'What is XSS and how to fix it?')..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        background: "#161B22",
                        border: "1px solid #30363D",
                        borderRadius: "12px",
                        padding: "0 16px",
                        height: "46px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                        width: "50px", height: "46px", border: "none", borderRadius: "12px",
                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                        color: "white", fontSize: "16px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: loading || !input.trim() ? 0.6 : 1
                    }}
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
}

export default AIChatbot;
