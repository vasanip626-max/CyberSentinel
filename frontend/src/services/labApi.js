const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";
const BASE_URLS = [API_BASE, "http://localhost:5000/api"];

const notifyInstantAttack = () => {
    try {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("attack_detected"));
            localStorage.setItem("last_attack_time", String(Date.now()));
        }
    } catch (e) {}
};

const request = async (endpoint, options = {}) => {
    let lastError = null;

    for (const baseUrl of BASE_URLS) {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                headers: { "Content-Type": "application/json", ...options.headers },
                ...options
            });

            const data = await response.json().catch(() => ({}));

            // Notify CyberSentinel Instant Listener in 0ms
            notifyInstantAttack();

            if (!response.ok) {
                const error = new Error(`Request failed with status ${response.status}`);
                error.response = { status: response.status, data };
                throw error;
            }

            return { data, status: response.status };
        } catch (err) {
            notifyInstantAttack();
            if (err.response) {
                throw err;
            }
            lastError = err;
        }
    }

    if (!lastError?.response) {
        lastError = new Error("Backend server offline");
        lastError.response = {
            status: 0,
            data: {
                message: "Backend server is offline or unreachable. Please start 'python app.py' in the backend directory (http://127.0.0.1:5000)."
            }
        };
    }
    throw lastError;
};

// Register a new lab user
export const labRegister = (formData) =>
    request("/lab/register", {
        method: "POST",
        body: JSON.stringify(formData)
    });

// Login a lab user - handles both labLogin(email, password) AND labLogin({ email, password })
export const labLogin = (emailOrObj, passwordArg) => {
    let email = emailOrObj;
    let password = passwordArg;

    if (typeof emailOrObj === "object" && emailOrObj !== null) {
        email = emailOrObj.email;
        password = emailOrObj.password;
    }

    return request("/lab/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
};

// Fetch employees with IDOR check
export const getEmployeeById = (empId) => {
    const userJson = localStorage.getItem("lab_user") || localStorage.getItem("user");
    let userEmail = "";
    let userId = "";
    try {
        if (userJson) {
            const parsed = JSON.parse(userJson);
            userEmail = parsed.email || "";
            userId = parsed.id || "";
        }
    } catch (e) {}

    return request(`/lab/employee/${empId}`, {
        method: "GET",
        headers: {
            "X-User-Email": userEmail,
            "X-User-Id": userId
        }
    });
};

// Fetch all employees (Search)
export const getEmployees = (query = "") =>
    request(`/lab/employees${query ? `?q=${encodeURIComponent(query)}` : ""}`, {
        method: "GET"
    });

// Fetch all users for Admin Panel
export const labGetUsers = () =>
    request("/lab/users", {
        method: "GET"
    });