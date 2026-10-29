import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaEnvelope,
    FaLock,
    FaKey,
    FaCheckCircle,
    FaArrowLeft,
    FaSpinner,
    FaEye,
    FaEyeSlash,
    FaExclamationCircle,
    FaPaperPlane
} from "react-icons/fa";
import api from "../services/api";
import "../styles/Login.css";

function ForgotPassword() {
    const navigate = useNavigate();

    // Step 1: Email, Step 2: OTP, Step 3: New Password, Step 4: Success
    const [step, setStep] = useState(1);

    const [email, setEmail]               = useState("");
    const [otp, setOtp]                   = useState("");
    const [newPassword, setNewPassword]   = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPass, setShowPass]         = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const [loading, setLoading]           = useState(false);
    const [errorMsg, setErrorMsg]         = useState("");
    const [successMsg, setSuccessMsg]     = useState("");

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (!email.trim()) {
            setErrorMsg("Email address is required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/forgot-password/request-otp", { email });
            setSuccessMsg(res.data.message || `6-digit OTP code sent to ${email}`);
            setStep(2);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Failed to send OTP code to email");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (!otp.trim() || otp.trim().length !== 6) {
            setErrorMsg("Please enter a valid 6-digit OTP code");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/forgot-password/verify-otp", { email, otp });
            setSuccessMsg(res.data.message || "OTP verified!");
            setStep(3);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Invalid OTP code");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!newPassword || newPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/forgot-password/reset-password", {
                email,
                otp,
                newPassword
            });
            setSuccessMsg(res.data.message || "Password updated successfully!");
            setStep(4);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Animated Floating Background Circles */}
            <div className="bg-circle circle-one"></div>
            <div className="bg-circle circle-two"></div>
            <div className="bg-circle circle-three"></div>

            {/* Cyber Sentinel Grid Overlay */}
            <div className="grid-overlay"></div>

            <div className="login-card">

                {/* Logo Section */}
                <div className="logo-section">
                    <FaShieldAlt className="shield-logo" />
                    <h1>Password Recovery</h1>
                    <p>
                        {step === 1 && "Step 1/3: Enter registered email address"}
                        {step === 2 && "Step 2/3: Enter 6-digit OTP code"}
                        {step === 3 && "Step 3/3: Create new password"}
                        {step === 4 && "Password Reset Complete!"}
                    </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div style={{
                        background: "rgba(255, 77, 109, 0.15)",
                        border: "1px solid rgba(255, 77, 109, 0.4)",
                        color: "#FF4D6D",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <FaExclamationCircle /> {errorMsg}
                    </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                    <div style={{
                        background: "rgba(0, 255, 153, 0.15)",
                        border: "1px solid rgba(0, 255, 153, 0.4)",
                        color: "#00FF99",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <FaCheckCircle /> {successMsg}
                    </div>
                )}

                {/* Email Sent Info Box */}
                {step === 2 && (
                    <div style={{
                        background: "rgba(0, 200, 255, 0.12)",
                        border: "1px solid rgba(0, 200, 255, 0.35)",
                        color: "#00C8FF",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <FaPaperPlane style={{ fontSize: "18px", flexShrink: 0 }} />
                        <div>
                            <strong>OTP Sent:</strong> A 6-digit verification code has been sent to <code>{email}</code>. Please check your inbox.
                        </div>
                    </div>
                )}

                {/* STEP 1: EMAIL ADDRESS INPUT */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp}>
                        <div className="input-group">
                            <label>Registered Email Address</label>
                            <div className="input-box">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your registered email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? <FaSpinner className="fa-spin" /> : "Send 6-Digit OTP Code"}
                        </button>
                    </form>
                )}

                {/* STEP 2: VERIFY 6-DIGIT OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <label>Enter 6-Digit OTP Code</label>
                            <div className="input-box">
                                <FaKey className="input-icon" style={{ color: "#00C8FF" }} />
                                <input
                                    type="text"
                                    maxLength="6"
                                    required
                                    placeholder="e.g. 231775"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "800" }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading} style={{ background: "linear-gradient(135deg, #00FF99, #00C8FF)", color: "#0F172A" }}>
                            {loading ? <FaSpinner className="fa-spin" /> : "Verify OTP Code"}
                        </button>
                    </form>
                )}

                {/* STEP 3: NEW PASSWORD & CONFIRM PASSWORD */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="input-box">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    placeholder="Enter new password..."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <div className="eye-icon" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <div className="input-box">
                                <FaLock className="input-icon" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    placeholder="Confirm new password..."
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <div className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? <FaSpinner className="fa-spin" /> : "Update Password in Database"}
                        </button>
                    </form>
                )}

                {/* STEP 4: SUCCESS SCREEN */}
                {step === 4 && (
                    <div style={{ textAlign: "center", padding: "10px 0" }}>
                        <FaCheckCircle style={{ fontSize: "56px", color: "#00FF99", marginBottom: "16px" }} />
                        <h3 style={{ color: "white", fontSize: "20px", margin: "0 0 8px 0" }}>Password Updated!</h3>
                        <p style={{ color: "#8B949E", fontSize: "14px", marginBottom: "24px" }}>
                            Your new password has been hashed and updated in the database.
                        </p>
                        <button onClick={() => navigate("/login")} className="login-btn">
                            Sign In with New Password
                        </button>
                    </div>
                )}

                {/* Footer Back Link */}
                <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                    <Link to="/login" style={{ color: "#8B949E", textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <FaArrowLeft /> Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword;
