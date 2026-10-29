import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaRocket, FaShieldAlt, FaBolt, FaCloud,
    FaChartBar, FaUsers, FaCode, FaArrowRight,
    FaStar, FaCheckCircle, FaBars, FaTimes
} from "react-icons/fa";
import "./Home.css";

const FEATURES = [
    { icon: <FaBolt />,     title: "Lightning Fast",     desc: "Deploy in seconds with our optimised cloud infrastructure built for scale." },
    { icon: <FaShieldAlt />, title: "Enterprise Security", desc: "SOC 2 Type II certified. End-to-end encryption on every request." },
    { icon: <FaChartBar />, title: "Real-time Analytics", desc: "Monitor performance, users, and revenue from a single dashboard." },
    { icon: <FaCloud />,    title: "Cloud Native",        desc: "Auto-scaling infrastructure that grows with your business." },
    { icon: <FaCode />,     title: "Developer First",     desc: "Clean REST APIs, SDKs for every major language, full docs." },
    { icon: <FaUsers />,    title: "Team Collaboration",  desc: "Roles, permissions, and audit logs built in from day one." },
];

const TESTIMONIALS = [
    { name: "Aarav Shah",    role: "CTO, ByteLeap",    text: "NovaSoft cut our deployment time by 70%. Absolutely game-changing platform.", rating: 5 },
    { name: "Meera Kapoor",  role: "CEO, DataStack",   text: "The analytics dashboard alone is worth it. We finally see everything in one place.", rating: 5 },
    { name: "Rohan Verma",   role: "Lead Dev, Clover", text: "Best DX I've experienced. Clean APIs, great docs, lightning-fast support.", rating: 5 },
];

const PLANS = [
    { name: "Starter",    price: "Free",  features: ["1 project", "5 team members", "10 GB storage", "Community support"] },
    { name: "Pro",        price: "₹999/mo", popular: true, features: ["Unlimited projects", "25 team members", "100 GB storage", "Priority support", "Advanced analytics"] },
    { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "SSO & SAML", "Dedicated SLA", "Custom integrations", "24/7 support"] },
];

function Home() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="ns-home">

            {/* Animated background */}
            <div className="ns-bg-blob blob-a"></div>
            <div className="ns-bg-blob blob-b"></div>
            <div className="ns-bg-blob blob-c"></div>
            <div className="ns-grid-overlay"></div>

            {/* ===== NAVBAR ===== */}
            <header className="ns-nav">
                <Link to="/lab" className="ns-logo">
                    <div className="ns-logo-icon"><FaRocket /></div>
                    <div className="ns-logo-text">
                        <span>NovaSoft</span>
                        <small>The Modern SaaS Platform</small>
                    </div>
                </Link>

                <nav className={`ns-navlinks ${menuOpen ? "open" : ""}`}>
                    <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#pricing"  onClick={() => setMenuOpen(false)}>Pricing</a>
                    <a href="#reviews"  onClick={() => setMenuOpen(false)}>Reviews</a>
                    <Link to="/lab/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                </nav>

                <div className="ns-nav-actions">
                    <Link to="/lab/login"    className="ns-btn-ghost">Log In</Link>
                    <Link to="/lab/register" className="ns-btn-solid">Get Started</Link>
                </div>

                <button className="ns-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </header>

            {/* ===== HERO ===== */}
            <section className="ns-hero">
                <div className="ns-hero-badge">
                    <FaBolt /> Trusted by 10,000+ developers worldwide
                </div>

                <h1>
                    Build Faster.<br />
                    <span className="ns-gradient-text">Ship Smarter.</span>
                </h1>

                <p>
                    NovaSoft is the all-in-one SaaS platform that gives your team
                    real-time analytics, cloud infrastructure, and enterprise security —
                    without the complexity.
                </p>

                <div className="ns-hero-btns">
                    <Link to="/lab/register" className="ns-btn-hero-primary">
                        Start for Free <FaArrowRight />
                    </Link>
                    <Link to="/lab/login" className="ns-btn-hero-ghost">
                        Sign In
                    </Link>
                </div>

                <div className="ns-hero-stats">
                    <div className="ns-stat"><strong>10K+</strong><span>Developers</span></div>
                    <div className="ns-stat-divider"></div>
                    <div className="ns-stat"><strong>99.9%</strong><span>Uptime SLA</span></div>
                    <div className="ns-stat-divider"></div>
                    <div className="ns-stat"><strong>150+</strong><span>Countries</span></div>
                    <div className="ns-stat-divider"></div>
                    <div className="ns-stat"><strong>4.9★</strong><span>Rating</span></div>
                </div>

                {/* Dashboard preview card */}
                <div className="ns-hero-card">
                    <div className="ns-card-header">
                        <div className="ns-card-dot red"></div>
                        <div className="ns-card-dot yellow"></div>
                        <div className="ns-card-dot green"></div>
                        <span>novasoft.io / dashboard</span>
                    </div>
                    <div className="ns-card-body">
                        <div className="ns-mini-stat">
                            <span>Active Users</span>
                            <strong>12,482</strong>
                            <em>↑ 14.2%</em>
                        </div>
                        <div className="ns-mini-stat">
                            <span>Revenue</span>
                            <strong>₹4.8L</strong>
                            <em>↑ 8.7%</em>
                        </div>
                        <div className="ns-mini-stat">
                            <span>Deployments</span>
                            <strong>342</strong>
                            <em>↑ 22.1%</em>
                        </div>
                        <div className="ns-bar-row">
                            {[65,80,45,90,55,75,88].map((h,i)=>(
                                <div key={i} className="ns-bar" style={{height:`${h}%`}}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="ns-features">
                <div className="ns-section-label">Everything You Need</div>
                <h2>Built for modern teams</h2>
                <p>From startup to enterprise — NovaSoft scales with you at every stage.</p>

                <div className="ns-features-grid">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="ns-feature-card">
                            <div className="ns-feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" className="ns-pricing">
                <div className="ns-section-label">Simple Pricing</div>
                <h2>Choose your plan</h2>
                <p>No hidden fees. Cancel anytime. Start free, upgrade when you're ready.</p>

                <div className="ns-plans-grid">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`ns-plan-card ${plan.popular ? "plan-popular" : ""}`}>
                            {plan.popular && <div className="ns-plan-badge">Most Popular</div>}
                            <h3>{plan.name}</h3>
                            <div className="ns-plan-price">{plan.price}</div>
                            <ul>
                                {plan.features.map((f, j) => (
                                    <li key={j}><FaCheckCircle /> {f}</li>
                                ))}
                            </ul>
                            <Link
                                to="/lab/register"
                                className={`ns-plan-btn ${plan.popular ? "plan-btn-filled" : "plan-btn-outline"}`}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section id="reviews" className="ns-testimonials">
                <div className="ns-section-label">Testimonials</div>
                <h2>Loved by developers</h2>
                <div className="ns-testimonials-grid">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="ns-testimonial-card">
                            <div className="ns-stars">
                                {Array(t.rating).fill(0).map((_,j) => <FaStar key={j} />)}
                            </div>
                            <p>"{t.text}"</p>
                            <div className="ns-testimonial-author">
                                <div className="ns-author-avatar">{t.name.charAt(0)}</div>
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="ns-cta">
                <h2>Ready to get started?</h2>
                <p>Join thousands of teams already building with NovaSoft.</p>
                <div className="ns-cta-btns">
                    <Link to="/lab/register" className="ns-btn-cta-primary">
                        Create Free Account <FaArrowRight />
                    </Link>
                    <Link to="/lab/contact" className="ns-btn-cta-ghost">
                        Talk to Sales
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="ns-footer">
                <div className="ns-footer-top">
                    <div className="ns-footer-brand">
                        <div className="ns-footer-logo">
                            <FaRocket /> NovaSoft
                        </div>
                        <p>The modern SaaS platform for fast-growing teams.</p>
                    </div>
                    <div className="ns-footer-links">
                        <div>
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#reviews">Reviews</a>
                        </div>
                        <div>
                            <h4>Company</h4>
                            <Link to="/lab/contact">Contact</Link>
                            <Link to="/lab/admin">Admin</Link>
                        </div>
                        <div>
                            <h4>Account</h4>
                            <Link to="/lab/login">Login</Link>
                            <Link to="/lab/register">Register</Link>
                        </div>
                    </div>
                </div>
                <div className="ns-footer-bottom">
                    <p>© 2026 NovaSoft Inc. All Rights Reserved.</p>
                    <p>⚠️ Intentionally Vulnerable — For Cybersecurity Training Only</p>
                </div>
            </footer>

        </div>
    );
}

export default Home;