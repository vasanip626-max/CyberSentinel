import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaRocket, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaClock, FaShieldAlt, FaPaperPlane, FaUser, FaCommentDots
} from "react-icons/fa";
import "./Contact.css";

function Contact() {
    const [form, setForm]   = useState({ name:"", email:"", subject:"", message:"" });
    const [sent, setSent]   = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1500);
    };

    const INFO = [
        { icon:<FaPhone />,       title:"Support Hotline",  value:"+1 800 NOVASOFT",   sub:"Mon–Fri, 9AM–6PM IST" },
        { icon:<FaEnvelope />,    title:"Email Support",    value:"hello@novasoft.io",  sub:"Reply within 2 hours" },
        { icon:<FaClock />,       title:"Working Hours",    value:"24/7 for Enterprise", sub:"Standard: Mon–Fri" },
        { icon:<FaMapMarkerAlt />,title:"Head Office",      value:"Bangalore, India",   sub:"560 001, Karnataka" },
    ];

    const OFFICES = [
        { city:"Bangalore", addr:"Koramangala 5th Block, Bangalore – 560 034", phone:"+91 80 4567 8901" },
        { city:"Mumbai",    addr:"BKC, Bandra East, Mumbai – 400 051",         phone:"+91 22 6789 0000" },
        { city:"San Francisco", addr:"Market St, SoMa, San Francisco, CA 94103", phone:"+1 415 000 0000" },
    ];

    return (
        <div className="vcontact-page">

            <div className="vcontact-blob vcblob1"></div>
            <div className="vcontact-blob vcblob2"></div>
            <div className="vcontact-grid"></div>

            {/* Navbar */}
            <header className="vcontact-nav">
                <Link to="/lab" className="vcontact-logo">
                    <div className="vcontact-logo-icon"><FaRocket /></div>
                    <div className="vcontact-logo-text">
                        <span>NovaSoft</span>
                        <small>The Modern SaaS Platform</small>
                    </div>
                </Link>
                <nav className="vcontact-navlinks">
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <Link to="/lab/login">Login</Link>
                    <Link to="/lab/register" className="vcontact-nav-cta">Get Started</Link>
                </nav>
            </header>

            {/* Hero */}
            <section className="vcontact-hero">
                <div className="vcontact-hero-label">
                    <FaShieldAlt /> Support & Contact
                </div>
                <h1>Get in <span>Touch</span></h1>
                <p>Our team is here to help. Reach out anytime and we'll respond within 2 hours.</p>
            </section>

            {/* Info cards */}
            <section className="vcontact-info-row">
                {INFO.map((item, i) => (
                    <div className="vcontact-info-card" key={i}>
                        <div className="vcontact-info-icon">{item.icon}</div>
                        <div>
                            <h4>{item.title}</h4>
                            <p>{item.value}</p>
                            <small>{item.sub}</small>
                        </div>
                    </div>
                ))}
            </section>

            {/* Body */}
            <section className="vcontact-body">

                {/* Form */}
                <div className="vcontact-form-card">
                    <h2>Send a Message</h2>
                    <p>Fill in the form and we'll get back to you shortly.</p>

                    {sent ? (
                        <div className="vcontact-success">
                            <FaPaperPlane />
                            <h3>Message Sent!</h3>
                            <p>Thanks, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 2 hours.</p>
                            <button onClick={() => { setSent(false); setForm({ name:"",email:"",subject:"",message:"" }); }}>
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form className="vcontact-form" onSubmit={handleSubmit}>
                            <div className="vcontact-row">
                                <div className="vcontact-field">
                                    <label>Full Name</label>
                                    <div className="vcontact-input-wrap">
                                        <FaUser />
                                        <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="vcontact-field">
                                    <label>Email</label>
                                    <div className="vcontact-input-wrap">
                                        <FaEnvelope />
                                        <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="vcontact-field">
                                <label>Subject</label>
                                <div className="vcontact-input-wrap">
                                    <FaCommentDots />
                                    <input name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="vcontact-field">
                                <label>Message</label>
                                <textarea name="message" rows={5} placeholder="Describe your issue or question..." value={form.message} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="vcontact-btn" disabled={loading}>
                                {loading
                                    ? <span className="vcontact-spinner"></span>
                                    : <><FaPaperPlane /> Send Message</>
                                }
                            </button>
                        </form>
                    )}
                </div>

                {/* Offices */}
                <div className="vcontact-offices">
                    <h2>Our Offices</h2>
                    <p>Visit us at any of our global locations.</p>
                    <div className="vcontact-office-list">
                        {OFFICES.map((o,i) => (
                            <div className="vcontact-office-card" key={i}>
                                <div className="vcontact-office-city">
                                    <FaMapMarkerAlt /> <strong>{o.city}</strong>
                                </div>
                                <p>{o.addr}</p>
                                <div className="vcontact-office-phone">
                                    <FaPhone /> {o.phone}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Footer */}
            <footer className="vcontact-footer">
                <p>© 2026 NovaSoft Inc. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Contact;
