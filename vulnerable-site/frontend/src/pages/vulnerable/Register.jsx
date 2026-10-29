import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaRocket, FaUser, FaEnvelope, FaLock,
    FaEye, FaEyeSlash, FaPhone, FaBriefcase,
    FaCheckCircle, FaArrowRight, FaShieldAlt, FaTimesCircle
} from "react-icons/fa";
import { labRegister } from "../../services/labApi";
import "./Register.css";

const ROLES = ["Developer", "Designer", "Manager", "Marketing", "Sales", "Other"];

function Register() {
    const navigate = useNavigate();
    const [step, setStep]       = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass]   = useState(false);
    const [showConf, setShowConf]   = useState(false);
    const [errors, setErrors]       = useState({});
    const [serverError, setServerError] = useState("");

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        phone: "", role: "", company: "",
        password: "", confirm: "", agree: false
    });

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
        setErrors(er => ({ ...er, [name]: "" }));
    };

    const validateStep1 = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim())  e.lastName  = "Last name is required";
        if (!form.email.trim())     e.email     = "Email is required";
        else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.phone.trim())     e.phone     = "Phone number is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e = {};
        if (!form.role)    e.role    = "Please select your role";
        if (!form.company.trim()) e.company = "Company / organisation is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep3 = () => {
        const e = {};
        if (!form.password)             e.password = "Password is required";
        else if (form.password.length < 8) e.password = "Minimum 8 characters";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        if (!form.agree) e.agree = "You must accept the terms";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(s => s + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep3()) return;
        setLoading(true);
        setServerError("");
        try {
            await labRegister({
                firstName: form.firstName,
                lastName:  form.lastName,
                email:     form.email,
                phone:     form.phone,
                role:      form.role,
                company:   form.company,
                password:  form.password
            });
            navigate("/lab/login", { state: { registered: true } });
        } catch (err) {
            setServerError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const strength = () => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8)        s++;
        if (/[A-Z]/.test(p))      s++;
        if (/[0-9]/.test(p))      s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };
    const strLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

    return (
        <div className="vreg-page">

            <div className="vreg-blob rblob1"></div>
            <div className="vreg-blob rblob2"></div>
            <div className="vreg-grid"></div>

            {/* Navbar */}
            <header className="vreg-nav">
                <Link to="/lab" className="vreg-logo">
                    <div className="vreg-logo-icon"><FaRocket /></div>
                    <div className="vreg-logo-text">
                        <span>NovaSoft</span>
                        <small>The Modern SaaS Platform</small>
                    </div>
                </Link>
                <div className="vreg-nav-right">
                    Already have an account?&nbsp;
                    <Link to="/lab/login">Sign In</Link>
                </div>
            </header>

            <main className="vreg-main">

                {/* Left panel */}
                <div className="vreg-left">
                    <div className="vreg-left-inner">
                        <div className="vreg-brand-icon"><FaRocket /></div>
                        <h2>Join 10,000+ developers on NovaSoft</h2>
                        <p>Get instant access to cloud infrastructure, real-time analytics, and enterprise security — free forever to start.</p>

                        <div className="vreg-perks">
                            {[
                                "No credit card required",
                                "Deploy in under 60 seconds",
                                "99.9% uptime guarantee",
                                "SOC 2 Type II certified",
                                "Cancel anytime, no questions"
                            ].map((perk, i) => (
                                <div key={i} className="vreg-perk">
                                    <FaCheckCircle /> {perk}
                                </div>
                            ))}
                        </div>

                        <div className="vreg-trusted">
                            <div className="vreg-avatars">
                                {["A","M","R","S","K"].map((l,i) => (
                                    <div key={i} className="vreg-av" style={{zIndex:5-i}}>{l}</div>
                                ))}
                            </div>
                            <span>Join thousands of happy users</span>
                        </div>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="vreg-right">

                    {/* Step indicator */}
                    <div className="vreg-steps">
                        {[1,2,3].map(n => (
                            <div key={n} className={`vreg-step ${step === n ? "step-active" : ""} ${step > n ? "step-done" : ""}`}>
                                <div className="vreg-step-circle">
                                    {step > n ? <FaCheckCircle /> : n}
                                </div>
                                <span>{["Your Info", "Work Details", "Set Password"][n-1]}</span>
                            </div>
                        ))}
                        <div className="vreg-step-line"></div>
                    </div>

                    {serverError && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)",
                            color: "#fca5a5", padding: "12px 16px", borderRadius: "10px",
                            marginBottom: "20px", fontSize: "14px"
                        }}>
                            <FaTimesCircle style={{ color: "#ef4444", flexShrink: 0 }} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form className="vreg-form" onSubmit={handleSubmit}>

                        {/* ── STEP 1 ── */}
                        {step === 1 && (
                            <>
                                <div className="vreg-form-title">
                                    <h3>Personal Information</h3>
                                    <p>Tell us a bit about yourself.</p>
                                </div>

                                <div className="vreg-row">
                                    <div className="vreg-field">
                                        <label>First Name</label>
                                        <div className={`vreg-input-wrap ${errors.firstName ? "err" : ""}`}>
                                            <FaUser />
                                            <input name="firstName" placeholder="Aarav" value={form.firstName} onChange={handle} />
                                        </div>
                                        {errors.firstName && <small>{errors.firstName}</small>}
                                    </div>
                                    <div className="vreg-field">
                                        <label>Last Name</label>
                                        <div className={`vreg-input-wrap ${errors.lastName ? "err" : ""}`}>
                                            <FaUser />
                                            <input name="lastName" placeholder="Shah" value={form.lastName} onChange={handle} />
                                        </div>
                                        {errors.lastName && <small>{errors.lastName}</small>}
                                    </div>
                                </div>

                                <div className="vreg-field">
                                    <label>Email Address</label>
                                    <div className={`vreg-input-wrap ${errors.email ? "err" : ""}`}>
                                        <FaEnvelope />
                                        <input name="email" type="email" placeholder="aarav@company.com" value={form.email} onChange={handle} />
                                    </div>
                                    {errors.email && <small>{errors.email}</small>}
                                </div>

                                <div className="vreg-field">
                                    <label>Phone Number</label>
                                    <div className={`vreg-input-wrap ${errors.phone ? "err" : ""}`}>
                                        <FaPhone />
                                        <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handle} />
                                    </div>
                                    {errors.phone && <small>{errors.phone}</small>}
                                </div>

                                <button type="button" className="vreg-next-btn" onClick={nextStep}>
                                    Continue <FaArrowRight />
                                </button>
                            </>
                        )}

                        {/* ── STEP 2 ── */}
                        {step === 2 && (
                            <>
                                <div className="vreg-form-title">
                                    <h3>Work Details</h3>
                                    <p>Help us personalise your experience.</p>
                                </div>

                                <div className="vreg-field">
                                    <label>Your Role</label>
                                    <div className="vreg-roles-grid">
                                        {ROLES.map(r => (
                                            <button
                                                key={r} type="button"
                                                className={`vreg-role-chip ${form.role === r ? "chip-active" : ""}`}
                                                onClick={() => { setForm(f=>({...f,role:r})); setErrors(e=>({...e,role:""})); }}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.role && <small>{errors.role}</small>}
                                </div>

                                <div className="vreg-field">
                                    <label>Company / Organisation</label>
                                    <div className={`vreg-input-wrap ${errors.company ? "err" : ""}`}>
                                        <FaBriefcase />
                                        <input name="company" placeholder="Acme Corp" value={form.company} onChange={handle} />
                                    </div>
                                    {errors.company && <small>{errors.company}</small>}
                                </div>

                                <div className="vreg-btn-row">
                                    <button type="button" className="vreg-back-btn" onClick={() => setStep(1)}>← Back</button>
                                    <button type="button" className="vreg-next-btn" onClick={nextStep}>
                                        Continue <FaArrowRight />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── STEP 3 ── */}
                        {step === 3 && (
                            <>
                                <div className="vreg-form-title">
                                    <h3>Secure Your Account</h3>
                                    <p>Create a strong password to protect your account.</p>
                                </div>

                                <div className="vreg-field">
                                    <label>Password</label>
                                    <div className={`vreg-input-wrap ${errors.password ? "err" : ""}`}>
                                        <FaLock />
                                        <input
                                            name="password" type={showPass ? "text" : "password"}
                                            placeholder="Min. 8 characters" value={form.password} onChange={handle}
                                        />
                                        <button type="button" className="vreg-eye" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && <small>{errors.password}</small>}
                                    {form.password && (
                                        <div className="vreg-strength">
                                            <div className="vreg-str-bar">
                                                {[1,2,3,4].map(n => (
                                                    <div key={n} className="vreg-str-seg" style={{background: n <= strength() ? strColor[strength()] : "#334155"}}></div>
                                                ))}
                                            </div>
                                            <span style={{color:strColor[strength()]}}>{strLabel[strength()]}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="vreg-field">
                                    <label>Confirm Password</label>
                                    <div className={`vreg-input-wrap ${errors.confirm ? "err" : ""}`}>
                                        <FaShieldAlt />
                                        <input
                                            name="confirm" type={showConf ? "text" : "password"}
                                            placeholder="Re-enter password" value={form.confirm} onChange={handle}
                                        />
                                        <button type="button" className="vreg-eye" onClick={() => setShowConf(!showConf)}>
                                            {showConf ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.confirm && <small>{errors.confirm}</small>}
                                </div>

                                <div className="vreg-agree">
                                    <input type="checkbox" id="agree" name="agree" checked={form.agree} onChange={handle} />
                                    <label htmlFor="agree">
                                        I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                                    </label>
                                </div>
                                {errors.agree && <small className="vreg-agree-err">{errors.agree}</small>}

                                <div className="vreg-btn-row">
                                    <button type="button" className="vreg-back-btn" onClick={() => setStep(2)}>← Back</button>
                                    <button type="submit" className="vreg-submit-btn" disabled={loading}>
                                        {loading
                                            ? <span className="vreg-spinner"></span>
                                            : <><FaRocket /> Create Account</>
                                        }
                                    </button>
                                </div>
                            </>
                        )}

                    </form>

                    <p className="vreg-signin">
                        Already have an account? <Link to="/lab/login">Sign in</Link>
                    </p>
                </div>

            </main>
        </div>
    );
}

export default Register;
