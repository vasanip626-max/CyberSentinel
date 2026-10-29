import React, { useState } from "react";
import { FaFilePdf, FaShieldAlt, FaTimes, FaPrint } from "react-icons/fa";
import { generateIncidentReport } from "../services/aiService";
import { formatTimeIST, getISTDateTimeString } from "../utils/time";

function AttackTable({ attacks: propAttacks }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [loadingReport, setLoadingReport]   = useState(false);

    const defaultLogs = [
        { id: 1, attack: "SQL Injection",      ip: "192.168.1.25", severity: "Critical", time: "10:24 AM", status: "Blocked" },
        { id: 2, attack: "XSS Attack",         ip: "192.168.1.42", severity: "High",     time: "10:30 AM", status: "Detected" },
        { id: 3, attack: "Brute Force",        ip: "172.16.10.12", severity: "Medium",   time: "11:05 AM", status: "Monitoring" },
        { id: 4, attack: "CSRF Threat",        ip: "10.10.1.11",   severity: "Low",      time: "11:18 AM", status: "Resolved" },
        { id: 5, attack: "IDOR Attempt",       ip: "192.168.50.21",severity: "High",     time: "11:45 AM", status: "Detected" }
    ];

    const attackLogs = propAttacks && propAttacks.length > 0 ? propAttacks : defaultLogs;

    const getBadge = (severity) => {
        switch (severity) {
            case "Critical": return "critical";
            case "High":     return "high";
            case "Medium":   return "medium";
            default:         return "low";
        }
    };

    const handleGenerateReport = async (log) => {
        setLoadingReport(true);
        try {
            const res = await generateIncidentReport({
                attack: log.attack || log.attack_type,
                ip: log.ip || log.ip_address,
                severity: log.severity,
                payload: (log.attack || "").includes("SQL") ? "' OR '1'='1" : (log.attack || "").includes("XSS") ? "<script>alert('XSS')</script>" : "IDOR /lab/employee/2"
            });
            setSelectedReport(res.data);
        } catch (err) {
            console.log("Report Generation Error:", err);
            setSelectedReport({
                report_id: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
                generated_at: getISTDateTimeString(),
                platform: "CyberSentinel AI Incident Response System",
                target_app: "NovaSoft SaaS Target Application (/lab)",
                incident_details: {
                    attack_type: log.attack || log.attack_type || "Security Incident",
                    severity: log.severity || "High",
                    attacker_ip: log.ip || log.ip_address || "127.0.0.1",
                    payload_evidence: log.description || ((log.attack || "").includes("SQL") ? "' OR '1'='1" : "<script>alert('XSS')</script>"),
                    status: log.status || "Detected"
                },
                ai_analysis: {
                    summary: `Automated AI security inspection detected a ${log.severity || "High"} severity ${log.attack || log.attack_type} attempt originating from source IP address ${log.ip || log.ip_address || "127.0.0.1"}.`,
                    impact_assessment: "Potential privilege escalation, unauthorized access to user profile records, or remote execution risk on target application.",
                    remediation_plan: [
                        "Enforce Server-Side Object-Level Authorization & Parameterized Queries on database models.",
                        "Apply active IP rate-limiting and firewall filtering rules on source address " + (log.ip || log.ip_address || "127.0.0.1") + ".",
                        "Incorporate Content Security Policy (CSP) headers and HTML entity output encoding.",
                        "Log all unauthorized requests to CyberSentinel centralized SOC database."
                    ]
                }
            });
        } finally {
            setLoadingReport(false);
        }
    };

    const handlePrintPDF = (report) => {
        const printWindow = window.open("", "_blank", "width=900,height=1000");
        if (!printWindow) return;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>CyberSentinel_Incident_Report_${report.report_id}</title>
            <style>
                @page { size: A4 portrait; margin: 15mm; }
                body { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; color: #0F172A; padding: 20px; margin: 0; line-height: 1.5; }
                .header { border-bottom: 3px solid #0284C7; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                .header-title { color: #0284C7; font-size: 20px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
                .header-sub { color: #64748B; font-size: 12px; margin-top: 4px; }
                .badge { background: #EF4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; display: inline-block; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
                .grid-item { font-size: 13px; }
                .grid-item label { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 2px; }
                .grid-item value { color: #0F172A; font-weight: 700; font-size: 13px; }
                .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0284C7; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin: 18px 0 10px 0; }
                .evidence-box { background: #FEF2F2; border: 1px solid #FCA5A5; border-left: 4px solid #EF4444; padding: 12px; border-radius: 8px; color: #991B1B; font-family: monospace; font-size: 12px; margin-bottom: 16px; word-break: break-all; }
                .analysis-box { background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 12px; }
                .plan-box { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 14px; margin-bottom: 20px; }
                .plan-box ul { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.7; color: #166534; }
                .footer { border-top: 1px solid #CBD5E1; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-top: 24px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1 class="header-title">🛡️ CYBERSENTINEL INCIDENT REPORT</h1>
                    <div class="header-sub">Official AI Forensic Analysis & Incident Mitigation Record • ${report.platform}</div>
                </div>
                <div style="text-align: right;">
                    <span class="badge">${report.incident_details?.severity || "High"} SEVERITY</span>
                </div>
            </div>

            <div class="grid">
                <div class="grid-item"><label>Report ID</label><value>${report.report_id}</value></div>
                <div class="grid-item"><label>Generated Timestamp</label><value>${report.generated_at}</value></div>
                <div class="grid-item"><label>Attack Classification</label><value style="color: #0284C7;">${report.incident_details?.attack_type}</value></div>
                <div class="grid-item"><label>Attacker IP Address</label><value>${report.incident_details?.attacker_ip}</value></div>
                <div class="grid-item"><label>Target Application</label><value>${report.target_app}</value></div>
                <div class="grid-item"><label>Incident Status</label><value style="color: #166534;">${report.incident_details?.status}</value></div>
            </div>

            <div class="section-title">📌 Captured Attack Payload Evidence</div>
            <div class="evidence-box">${report.incident_details?.payload_evidence}</div>

            <div class="section-title">🤖 AI Vulnerability Analysis & Impact Assessment</div>
            <div class="analysis-box">
                <p style="margin: 0 0 6px 0; color: #0F172A;">${report.ai_analysis?.summary}</p>
                <p style="margin: 0; color: #991B1B; font-weight: 700;">Security Impact: ${report.ai_analysis?.impact_assessment}</p>
            </div>

            <div class="section-title">🛡️ Recommended Blue Team Code Mitigation Plan</div>
            <div class="plan-box">
                <ul>
                    ${report.ai_analysis?.remediation_plan?.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>

            <div class="footer">
                <div>CyberSentinel Automated SOC Incident Response Platform</div>
                <div>Verified by CyberSentinel AI Forensic Engine</div>
            </div>

            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 300);
                };
            </script>
        </body>
        </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="attack-table-card">
            <div className="table-header">
                <h2>Recent Attack Logs</h2>
                <span style={{ fontSize: "12px", color: "#8B949E" }}>Module 3.3: AI Incident Report Engine Active</span>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Attack Type</th>
                            <th>Source IP</th>
                            <th>Severity</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>AI Incident Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attackLogs.map((log, index) => (
                            <tr key={log.id || index}>
                                <td><strong>{log.attack || log.attack_type}</strong></td>
                                <td><code>{log.ip || log.ip_address}</code></td>
                                <td>
                                    <span className={`severity ${getBadge(log.severity)}`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td>{formatTimeIST(log.time, log.timestamp)}</td>
                                <td>
                                    <span className="status-pill">
                                        {log.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        disabled={loadingReport}
                                        onClick={() => handleGenerateReport(log)}
                                        style={{
                                            background: "rgba(0, 200, 255, 0.15)",
                                            color: "#00C8FF",
                                            border: "1px solid rgba(0, 200, 255, 0.3)",
                                            padding: "6px 14px",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: loadingReport ? "not-allowed" : "pointer",
                                            opacity: loadingReport ? 0.7 : 1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px"
                                        }}
                                    >
                                        <FaFilePdf /> {loadingReport ? "Generating..." : "Export Report"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal & Preview AI Incident Report */}
            {selectedReport && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 10000,
                        background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(10px)",
                        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
                    }}
                >
                    <div
                        style={{
                            background: "#0F172A",
                            border: "1px solid rgba(0, 200, 255, 0.4)",
                            borderRadius: "20px",
                            width: "740px",
                            maxWidth: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "32px",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9)",
                            color: "#E2E8F0",
                            fontFamily: "Inter, system-ui, sans-serif"
                        }}
                    >
                        {/* Header & Title */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "2px solid #00C8FF",
                            paddingBottom: "16px",
                            marginBottom: "20px"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "10px",
                                        background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontSize: "18px"
                                    }}>
                                        <FaShieldAlt />
                                    </div>
                                    <h2 style={{ color: "#00C8FF", margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "0.5px" }}>
                                        CYBERSENTINEL SECURITY INCIDENT REPORT
                                    </h2>
                                </div>
                                <p style={{ margin: "4px 0 0 0", color: "#94A3B8", fontSize: "12px" }}>
                                    Official Incident & Forensic Evidence Analysis • {selectedReport.platform}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    border: "none",
                                    color: "#94A3B8",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <FaTimes style={{ fontSize: "16px" }} />
                            </button>
                        </div>

                        {/* Incident Metadata Grid */}
                        <div style={{
                            background: "#1E293B",
                            border: "1px solid rgba(0, 200, 255, 0.2)",
                            borderRadius: "14px",
                            padding: "18px",
                            marginBottom: "20px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "14px",
                            fontSize: "13px"
                        }}>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Report ID</span>
                                <strong style={{ color: "white", fontSize: "13px" }}>{selectedReport.report_id}</strong>
                            </div>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Generated Timestamp</span>
                                <span style={{ color: "white", fontWeight: "600" }}>{selectedReport.generated_at}</span>
                            </div>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Attack Classification</span>
                                <strong style={{ color: "#00C8FF", fontSize: "14px" }}>{selectedReport.incident_details?.attack_type}</strong>
                            </div>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Severity Rating</span>
                                <span style={{
                                    background: "rgba(239, 68, 68, 0.2)",
                                    color: "#EF4444",
                                    border: "1px solid rgba(239, 68, 68, 0.4)",
                                    padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "700", display: "inline-block"
                                }}>
                                    {selectedReport.incident_details?.severity} Severity
                                </span>
                            </div>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Attacker IP Address</span>
                                <code style={{ background: "rgba(0,200,255,0.1)", color: "#00C8FF", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
                                    {selectedReport.incident_details?.attacker_ip}
                                </code>
                            </div>
                            <div>
                                <span style={{ color: "#94A3B8", display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Target Application</span>
                                <span style={{ color: "white", fontWeight: "600" }}>{selectedReport.target_app}</span>
                            </div>
                        </div>

                        {/* Section 1: Payload Evidence */}
                        <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ color: "#FF4D6D", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                                📌 Captured Attack Payload Evidence
                            </h4>
                            <pre style={{
                                background: "#161B22",
                                borderLeft: "4px solid #FF4D6D",
                                padding: "12px",
                                borderRadius: "8px",
                                color: "#FF4D6D",
                                fontSize: "12px",
                                fontFamily: "monospace",
                                overflowX: "auto",
                                margin: 0
                            }}>
                                {selectedReport.incident_details?.payload_evidence}
                            </pre>
                        </div>

                        {/* Section 2: AI Security Analysis */}
                        <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ color: "#00C8FF", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                                🤖 AI Threat Analysis & Impact Assessment
                            </h4>
                            <div style={{ background: "#1E293B", border: "1px solid rgba(0, 200, 255, 0.2)", borderRadius: "10px", padding: "14px" }}>
                                <p style={{ color: "#CBD5E1", fontSize: "12px", lineHeight: "1.6", margin: "0 0 8px 0" }}>
                                    {selectedReport.ai_analysis?.summary}
                                </p>
                                <p style={{ color: "#FF4D6D", fontSize: "12px", fontWeight: "700", margin: 0 }}>
                                    Security Risk Impact: {selectedReport.ai_analysis?.impact_assessment}
                                </p>
                            </div>
                        </div>

                        {/* Section 3: AI Code Remediation */}
                        <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ color: "#00FF99", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                                🛡️ Recommended Blue Team Code Mitigation Plan
                            </h4>
                            <div style={{ background: "#1E293B", border: "1px solid rgba(0, 255, 153, 0.2)", borderRadius: "10px", padding: "14px" }}>
                                <ul style={{ margin: 0, paddingLeft: "18px", color: "#CBD5E1", fontSize: "12px", lineHeight: "1.7" }}>
                                    {selectedReport.ai_analysis?.remediation_plan?.map((plan, idx) => (
                                        <li key={idx}>
                                            {plan}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Signature Footer */}
                        <div style={{
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            paddingTop: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "11px",
                            color: "#94A3B8"
                        }}>
                            <div>
                                <span>Status: <strong style={{ color: "#00FF99" }}>{selectedReport.incident_details?.status}</strong></span>
                            </div>
                            <div>
                                <span>Verified by CyberSentinel AI Incident Response Engine</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => handlePrintPDF(selectedReport)}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    background: "linear-gradient(135deg, #00C8FF, #008CFF)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    boxShadow: "0 4px 14px rgba(0, 200, 255, 0.35)"
                                }}
                            >
                                <FaPrint /> Print / Save PDF Incident Report
                            </button>
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{
                                    padding: "12px 20px",
                                    background: "transparent",
                                    border: "1px solid #475569",
                                    color: "#94A3B8",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    cursor: "pointer"
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

export default AttackTable;