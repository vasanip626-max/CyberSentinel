import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaShieldAlt,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSignInAlt,
    FaTimesCircle
} from "react-icons/fa";

import { labLogin } from "../services/labApi";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    // -------------------------
    // Validation
    // -------------------------

    const validateForm = () => {

        let newErrors = {};

        if (email.trim() === "") {

            newErrors.email = "Email is required";

        }

        else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {

            newErrors.email = "Invalid email address";

        }

        if (password === "") {

            newErrors.password = "Password is required";

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    // -------------------------
    // Login User
    // -------------------------

    const loginUser = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;

        }

        setLoading(true);

        try {

            const response = await labLogin(email, password);

            const tokenVal = response.data?.token || response.data?.access_token || "demo_jwt_token";

            localStorage.setItem("token", tokenVal);
            localStorage.setItem("user", JSON.stringify(response.data?.user || { email }));
            localStorage.setItem("lab_user", JSON.stringify(response.data?.user || { email }));

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            }

            navigate("/dashboard");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="bg-circle circle-one"></div>

            <div className="bg-circle circle-two"></div>

            <div className="bg-circle circle-three"></div>

            <div className="grid-overlay"></div>

            <div className="login-card">

                <div className="logo-section">

                    <FaShieldAlt className="shield-logo" />

                    <h1>
                        CyberSentinel Security
                    </h1>

                    <p>
                        Cyber Sentinel Platform
                    </p>

                    <span>

                        Innovation • Technology • Solutions

                    </span>

                </div>

                <form onSubmit={loginUser}>
                                        {/* Email */}

                    <div className="input-group">

                        <label>

                            Email Address

                        </label>

                        <div className="input-box">

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

                            <small>

                                <FaTimesCircle />

                                {errors.email}

                            </small>

                        }

                    </div>

                    {/* Password */}

                    <div className="input-group">

                        <label>

                            Password

                        </label>

                        <div className="input-box">

                            <FaLock className="input-icon" />

                            <input

                                type={showPassword ? "text" : "password"}

                                placeholder="Enter your password"

                                value={password}

                                onChange={(e) => setPassword(e.target.value)}

                            />

                            <div

                                className="eye-icon"

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

                            </div>

                        </div>

                        {

                            errors.password &&

                            <small>

                                <FaTimesCircle />

                                {errors.password}

                            </small>

                        }

                    </div>

                    {/* Remember Me */}

                    <div className="login-options">

                        <div className="remember-me">

                            <input

                                type="checkbox"

                                id="remember"

                                checked={rememberMe}

                                onChange={() =>

                                    setRememberMe(!rememberMe)

                                }

                            />

                            <label htmlFor="remember">

                                Remember Me

                            </label>

                        </div>

                        <Link

                            to="/forgot-password"

                            className="forgot-link"

                        >

                            Forgot Password?

                        </Link>

                    </div>

                    {/* Login Button */}

                    <button

                        type="submit"

                        className="login-btn"

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                <>

                                    <span className="loader"></span>

                                    Signing In...

                                </>

                                :

                                <>

                                    <FaSignInAlt />

                                    Login

                                </>

                        }

                    </button>

                    {/* Divider */}

                    <div className="divider">

                        <span>

                            OR

                        </span>

                    </div>

                    {/* Register */}

                    <div className="register-section">

                        <p>

                            Don't have an account?

                        </p>

                        <Link

                            to="/"

                            className="register-link"

                        >

                            CREATE ACCOUNT

                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default Login;