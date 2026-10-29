import React, { useState, useRef, useEffect } from "react";
import {
    FaRobot,
    FaPaperPlane,
    FaUser,
    FaTimes,
    FaSpinner
} from "react-icons/fa";
import { sendAIChatMessage } from "../services/aiService";

// Helper to format Markdown-like bold, headers, code blocks and linebreaks
function renderFormattedAIResponse(text) {
    if (!text) return null;

    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeBuffer = [];

    const elements = [];

    lines.forEach((line, idx) => {
        if (line.startsWith("```")) {
            if (inCodeBlock) {
                // End code block
                elements.push(
                    <pre
                        key={`code-${idx}`}
                        style={{
                            background: "#0D1117",
                            color: "#00C8FF",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            margin: "8px 0",
                            whiteSpace: "pre-wrap",
                            overflowX: "auto"
                        }}
                    >
                        {codeBuffer.join("\n")}
                    </pre>
                );
                codeBuffer = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }

        if (inCodeBlock) {
            codeBuffer.push(line);
            return;
        }

        if (line.startsWith("### ")) {
            elements.push(
                <h4 key={idx} style={{ color: "#00C8FF", fontSize: "14px", marginTop: "12px", marginBottom: "6px" }}>
                    {line.replace("### ", "")}
                </h4>
            );
        } else if (line.trim() === "") {
            elements.push(<div key={idx} style={{ height: "6px" }} />);
        } else {
            // Process bold formatting **text**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i} style={{ color: "white" }}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            elements.push(
                <p key={idx} style={{ margin: "2px 0", color: "#C9D1D9", fontSize: "13px", lineHeight: "1.6" }}>
                    {formattedParts}
                </p>
            );
        }
    });

    return elements;
}

function FloatingAIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! 👋 I am your CyberSentinel AI Assistant. Ask me about any web attack — what it is, its potential outcomes, and how to overcome it!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, loading, isOpen]);

    const streamAIResponse = (fullText) => {
        let index = 0;
        const speed = 12; // 12ms per character chunk stream

        setMessages((prev) => [...prev, { sender: "ai", text: "", isStreaming: true }]);

        const interval = setInterval(() => {
            index += Math.floor(Math.random() * 3) + 2;
            if (index >= fullText.length) {
                index = fullText.length;
                clearInterval(interval);
                setLoading(false);
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { sender: "ai", text: fullText, isStreaming: false };
                    return updated;
                });
            } else {
                const currentText = fullText.slice(0, index);
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { sender: "ai", text: currentText, isStreaming: true };
                    return updated;
                });
            }
        }, speed);
    };

    const handleSend = async (queryText = null) => {
        const textToSend = queryText || input;
        if (!textToSend.trim() || loading) return;

        const userMsg = { sender: "user", text: textToSend };
        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInput("");
        setLoading(true);

        try {
            const res = await sendAIChatMessage(textToSend);
            const fullText = res.data.response_text || res.data.ai_response_text || `Analysis complete for '${textToSend}'.`;
            streamAIResponse(fullText);
        } catch (err) {
            console.log("Chatbot error:", err);
            const lower = textToSend.toLowerCase();
            let text = "🤖 **SQL Injection (SQLi)** - Critical Priority\n\n### ⚙️ Technical Overview:\nSQL Injection occurs when untrusted user input is directly concatenated into SQL query strings.\n\n### 💥 Vulnerability Impact:\n• Authentication bypass\n• Sensitive database data leakage\n\n### 🛡️ Code Fix:\n```python\ncursor.execute('SELECT * FROM users WHERE email = %s', (user_input,))\n```";

            if (lower.includes("xss") || lower.includes("script")) {
                text = "🤖 **Cross-Site Scripting (XSS)** - High Priority\n\n### ⚙️ Technical Overview:\nXSS allows attackers to inject client-side scripts into web pages.\n\n### 💥 Vulnerability Impact:\n• Session hijacking & cookie theft\n• DOM defacement\n\n### 🛡️ Code Fix:\n```javascript\nelement.textContent = userInput;\n```";
            }

            streamAIResponse(text);
        }
    };

    const promptChips = [
        "What is IDOR?",
        "Explain SQL Injection",
        "Explain XSS & outcomes",
        "How to stop Brute Force?",
        "What is CSRF?"
    ];

    return (
        <>
            {/* Floating Action Button (FAB) at Bottom Right */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "28px",
                    right: "28px",
                    zIndex: 9999,
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                    boxShadow: "0 0 25px rgba(0, 200, 255, 0.5), 0 10px 25px rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    border: "2px solid rgba(255, 255, 255, 0.3)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaRobot style={{ fontSize: "28px", color: "white" }} />
                    <span style={{
                        position: "absolute",
                        top: "-12px",
                        right: "-12px",
                        background: "#FF4D6D",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        border: "2px solid #0D1117"
                    }}>
                        AI
                    </span>
                </div>
            </div>

            {/* Floating Chat Window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "98px",
                    right: "28px",
                    zIndex: 9999,
                    width: "440px",
                    maxWidth: "calc(100vw - 40px)",
                    height: "580px",
                    maxHeight: "calc(100vh - 120px)",
                    background: "rgba(13, 17, 23, 0.96)",
                    border: "1px solid rgba(0, 200, 255, 0.3)",
                    borderRadius: "20px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 200, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }}>

                    {/* Window Header */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(22, 27, 34, 0.98), rgba(13, 17, 23, 0.98))",
                        padding: "16px 20px",
                        borderBottom: "1px solid rgba(0, 200, 255, 0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "36px", height: "36px", borderRadius: "10px",
                                background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", fontSize: "18px"
                            }}>
                                <FaRobot />
                            </div>
                            <div>
                                <h4 style={{ color: "white", margin: 0, fontSize: "15px", fontWeight: "700" }}>
                                    CyberSentinel AI Assistant
                                </h4>
                                <span style={{ color: "#00FF99", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    ● Live AI Stream Engine Active
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "none",
                                color: "#8B949E",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "0.2s"
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div style={{
                        padding: "10px 16px",
                        background: "#161B22",
                        borderBottom: "1px solid #21262D",
                        display: "flex",
                        gap: "6px",
                        overflowX: "auto",
                        whiteSpace: "nowrap"
                    }}>
                        {promptChips.map((chip, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(chip)}
                                style={{
                                    background: "rgba(0, 200, 255, 0.1)",
                                    border: "1px solid rgba(0, 200, 255, 0.25)",
                                    color: "#00C8FF",
                                    fontSize: "11px",
                                    padding: "4px 10px",
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    flexShrink: 0
                                }}
                            >
                                ✨ {chip}
                            </button>
                        ))}
                    </div>

                    {/* Chat Messages Body */}
                    <div style={{
                        flex: 1,
                        padding: "16px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px"
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
                                }}
                            >
                                {msg.sender === "ai" && (
                                    <div style={{
                                        width: "30px", height: "30px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, fontSize: "14px"
                                    }}>
                                        <FaRobot />
                                    </div>
                                )}

                                <div style={{
                                    maxWidth: "88%",
                                    background: msg.sender === "user" ? "linear-gradient(135deg, #00C8FF, #008CFF)" : "#161B22",
                                    color: "white",
                                    padding: "12px 16px",
                                    borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                                    border: msg.sender === "ai" ? "1px solid #30363D" : "none",
                                    fontSize: "13px",
                                    lineHeight: "1.6"
                                }}>
                                    {msg.sender === "ai"
                                        ? renderFormattedAIResponse(msg.text)
                                        : <p style={{ margin: 0 }}>{msg.text}</p>
                                    }
                                </div>

                                {msg.sender === "user" && (
                                    <div style={{
                                        width: "30px", height: "30px", borderRadius: "50%",
                                        background: "#30363D", color: "#00C8FF",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, fontSize: "14px"
                                    }}>
                                        <FaUser />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && messages[messages.length - 1]?.sender !== "ai" && (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#8B949E", fontSize: "12px" }}>
                                <FaRobot style={{ color: "#00C8FF" }} />
                                <FaSpinner className="fa-spin" style={{ color: "#00C8FF" }} />
                                <span>AI is analyzing security query...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Footer */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        style={{
                            padding: "12px 16px",
                            background: "#161B22",
                            borderTop: "1px solid #21262D",
                            display: "flex",
                            gap: "8px"
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Ask AI anything (e.g. 'What is IDOR?')..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{
                                flex: 1,
                                background: "#0D1117",
                                border: "1px solid #30363D",
                                borderRadius: "10px",
                                padding: "0 12px",
                                height: "40px",
                                color: "white",
                                fontSize: "13px",
                                outline: "none"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                width: "40px",
                                height: "40px",
                                border: "none",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                color: "white",
                                fontSize: "14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: loading || !input.trim() ? 0.6 : 1
                            }}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>

                </div>
            )}
        </>
    );
}

export default FloatingAIChatbot;
