import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register       from "./pages/Register";
import Login          from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard      from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ── CyberSentinel Platform Routes ── */}
                <Route path="/"                element={<Register />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard"       element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;