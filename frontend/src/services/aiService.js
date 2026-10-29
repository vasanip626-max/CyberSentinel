import api from "./api";

// Send threat analysis query or payload to backend AI engine
export const analyzeThreatWithAI = (payloadData) =>
    api.post("/ai/analyze", payloadData);

// Send message to AI Chatbot
export const sendAIChatMessage = (message) =>
    api.post("/ai/chat", { message });

// Fetch dynamic AI recommendations
export const getAIRecommendations = () =>
    api.get("/ai/recommendations");

// Module 3.3: Generate Incident Report
export const generateIncidentReport = (incidentData) =>
    api.post("/ai/report/generate", incidentData);
