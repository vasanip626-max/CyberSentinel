import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaShieldAlt,
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import { labRegister } from "../services/labApi";
import "../styles/Register.css";

function Register() {

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();

    // -----------------------------
    // Password Strength
    // -----------------------------

    const checkPasswordStrength = (value) => {

        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        setPasswordStrength(score);
        setPassword(value);

    };

    // -----------------------------
    // Validation
    // -----------------------------

    const validateForm = () => {

        const newErrors = {};

        if (!fullname.trim()) {

            newErrors.fullname = "Full Name is required";

        }

        if (!email.trim()) {

            newErrors.email = "Email is required";

        }

        else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {

            newErrors.email = "Invalid Email Address";

        }

        if (password.length < 8) {

            newErrors.password =
                "Password must be at least 8 characters";

        }

        if (password !== confirmPassword) {

            newErrors.confirmPassword =
                "Passwords do not match";

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    // -----------------------------
    // Register User
    // -----------------------------

    const registerUser = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const parts = fullname.trim().split(" ");
            const firstName = parts[0] || fullname;
            const lastName  = parts.slice(1).join(" ") || "User";

            const response = await labRegister({
                firstName,
                lastName,
                fullName: fullname,
                name: fullname,
                email,
                password
            });

            alert(response.data.message);

            navigate("/login");

            setFullname("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setPasswordStrength(0);

            setErrors({});

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        }

        finally {

            setLoading(false);

        }

    };

    // -----------------------------
    // Password Strength Color
    // -----------------------------

    const getStrengthColor = () => {

        switch (passwordStrength) {

            case 1:
                return "#ff4d6d";

            case 2:
                return "#ff9800";

            case 3:
                return "#ffc107";

            case 4:
                return "#00c8ff";

            case 5:
                return "#00ff99";

            default:
                return "#555";

        }

    };

    const getStrengthText = () => {

        switch (passwordStrength) {

            case 1:
                return "Weak";

            case 2:
                return "Fair";

            case 3:
                return "Good";

            case 4:
                return "Strong";

            case 5:
                return "Very Strong";

            default:
                return "Weak";

        }

    };

    return(

        <div className="register-container">

            <div className="background-circle circle1"></div>
            <div className="background-circle circle2"></div>
            <div className="background-circle circle3"></div>

            <div className="register-card">

                <div className="logo-section">

                    <FaShieldAlt className="shield-logo" />

                    <h1>CyberSentinel Security</h1>

                    <p>Cyber Sentinel Platform</p>

                    <h3>Innovation • Technology • Solutions</h3>

                </div>

                <form onSubmit={registerUser}>
                                        {/* Full Name */}

                    <div className="input-box">

                        <label>👤 Full Name</label>

                        <div className="input-field">

                            <FaUser className="input-icon" />

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />

                        </div>

                        {

                            errors.fullname &&

                            <span className="error-text">

                                <FaTimesCircle /> {errors.fullname}

                            </span>

                        }

                    </div>

                    {/* Email */}

                    <div className="input-box">

                        <label>📧 Email Address</label>

                        <div className="input-field">

                            <FaEnvelope className="input-icon" />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        {

                            errors.email &&

                            <span className="error-text">

                                <FaTimesCircle /> {errors.email}

                            </span>

                        }

                    </div>

                    {/* Password */}

                    <div className="input-box">

                        <label>🔒 Password</label>

                        <div className="input-field">

                            <FaLock className="input-icon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                value={password}
                                onChange={(e) =>
                                    checkPasswordStrength(e.target.value)
                                }
                            />

                            <span
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >

                                {

                                    showPassword

                                        ?

                                        <FaEyeSlash />

                                        :

                                        <FaEye />

                                }

                            </span>

                        </div>

                        {

                            errors.password &&

                            <span className="error-text">

                                <FaTimesCircle /> {errors.password}

                            </span>

                        }

                    </div>

                    {/* Password Strength */}

                    <div className="strength-wrapper">

                        <div className="strength-header">

                            <p>Password Strength</p>

                            <span
                                style={{
                                    color: getStrengthColor()
                                }}
                            >

                                {getStrengthText()}

                            </span>

                        </div>

                        <div className="strength-bar">

                            <div
                                className="strength-fill"
                                style={{
                                    width: `${passwordStrength * 20}%`,
                                    background: getStrengthColor()
                                }}
                            ></div>

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div className="input-box">

                        <label>🔒 Confirm Password</label>

                        <div className="input-field">

                            <FaLock className="input-icon" />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <span
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >

                                {

                                    showConfirmPassword

                                        ?

                                        <FaEyeSlash />

                                        :

                                        <FaEye />

                                }

                            </span>

                        </div>

                        {

                            errors.confirmPassword &&

                            <span className="error-text">

                                <FaTimesCircle /> {errors.confirmPassword}

                            </span>

                        }

                    </div>

                    {/* Register Button */}

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >

                        {

                            loading

                                ?

                                "Creating Account..."

                                :

                                <>

                                    <FaCheckCircle
                                        style={{
                                            marginRight: "8px"
                                        }}
                                    />

                                    CREATE ACCOUNT

                                </>

                        }

                    </button>

                    {/* Login Link */}

                    <div className="login-link">

                        Already have an account?

                        <Link
                            to="/login"
                            style={{
                                color: "#00C8FF",
                                marginLeft: "8px",
                                textDecoration: "none",
                                fontWeight: "600"
                            }}
                        >

                            LOGIN

                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default Register;