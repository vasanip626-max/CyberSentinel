/**
 * Utility to ensure all timestamps and times are formatted according to Indian Standard Time (IST).
 */
export const formatTimeIST = (timeStr, timestamp) => {
    // If timestamp is provided as ISO string, UTC string, or Date object
    if (timestamp) {
        try {
            const date = new Date(timestamp);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });
            }
        } catch (e) {
            // ignore and fallback
        }
    }

    if (timeStr && (timeStr.includes("AM") || timeStr.includes("PM"))) {
        return timeStr;
    }

    return timeStr || "Just Now";
};

export const getISTDateTimeString = (date = new Date()) => {
    try {
        return new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "medium",
            hour12: true
        }).format(date);
    } catch (e) {
        return date.toLocaleString();
    }
};
