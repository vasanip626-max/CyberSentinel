import axios from "axios";

// Uses Vercel production URL if set, otherwise falls back to local dev
const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(async (config) => {
    config.baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";
    return config;
});

export default api;