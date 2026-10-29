import React from "react";
import { FaCircle } from "react-icons/fa";

function StatusCard({ title, status }) {
    const statusStr = (status || "").toLowerCase().trim();

    const isHealthy = ["running", "enabled", "online", "connected"].includes(statusStr);
    const isWarning = ["warning", "degraded", "monitoring"].includes(statusStr);

    const getColor = () => {
        if (isHealthy) return "#00FF99"; // Green for healthy
        if (isWarning) return "#FFC107"; // Yellow for warning
        return "#FF4D6D";               // Bright Red for offline, disabled, disconnected, or down
    };

    return (
        <div className="status-card" style={{
            border: `1px solid ${isHealthy ? 'rgba(0, 255, 153, 0.25)' : 'rgba(255, 77, 109, 0.35)'}`,
            background: isHealthy ? "rgba(22, 27, 34, 0.94)" : "rgba(255, 77, 109, 0.08)"
        }}>
            <div className="status-left">
                <FaCircle
                    className="status-dot"
                    style={{ color: getColor(), filter: `drop-shadow(0 0 6px ${getColor()})` }}
                />
                <h4>{title}</h4>
            </div>

            <span
                className="status-text"
                style={{ color: getColor(), fontWeight: "700" }}
            >
                {status}
            </span>
        </div>
    );
}

export default StatusCard;