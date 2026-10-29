import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import {
    FaRocket,
    FaSearch,
    FaUser,
    FaEnvelope,
    FaBriefcase,
    FaMapMarkerAlt,
    FaPhone,
    FaShieldAlt,
    FaTimes,
    FaExclamationTriangle,
    FaDatabase,
    FaArrowRight
} from "react-icons/fa";
import { getEmployees } from "../../services/labApi";
import "./Search.css";

function Search() {
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const lastExecutedScript = useRef("");

    // Detect search query from URL path (/search/:query) or query param (?q=...)
    useEffect(() => {
        let initialQuery = searchParams.get("q") || params.query || "";
        
        // Also check if path has trailing search term (e.g. /search/<script>alert(1)</script>)
        if (!initialQuery) {
            const path = decodeURIComponent(location.pathname);
            if (path.startsWith("/search/")) {
                initialQuery = path.slice(8);
            } else if (path.startsWith("/lab/search/")) {
                initialQuery = path.slice(12);
            }
        }

        if (initialQuery) {
            setQuery(initialQuery);
            setSearched(true);
            fetchEmployees(initialQuery);
        } else {
            // Load initial directory
            fetchEmployees("");
        }
    }, [location.pathname, searchParams, params.query]);

    // Reflected XSS Script Execution Engine for intentional lab demonstration
    useEffect(() => {
        if (query && (query.includes("<script") || query.includes("javascript:"))) {
            if (lastExecutedScript.current !== query) {
                lastExecutedScript.current = query;
                try {
                    const temp = document.createElement("div");
                    temp.innerHTML = query;
                    const scripts = temp.getElementsByTagName("script");
                    for (let s of scripts) {
                        const newScript = document.createElement("script");
                        newScript.text = s.innerHTML;
                        document.body.appendChild(newScript);
                        setTimeout(() => {
                            try {
                                document.body.removeChild(newScript);
                            } catch (_) {}
                        }, 500);
                    }
                } catch (err) {
                    console.error("XSS Execution Error:", err);
                }
            }
        }
    }, [query, searched]);

    const fetchEmployees = async (searchQuery) => {
        setLoading(true);
        try {
            const res = await getEmployees(searchQuery);
            setResults(res.data || []);
        } catch (err) {
            console.error("Employee search error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearched(true);
        fetchEmployees(query);
    };

    const clearSearch = () => {
        setQuery("");
        setSearched(false);
        lastExecutedScript.current = "";
        fetchEmployees("");
    };

    // Detect if current query contains SQL injection syntax for visual indication
    const isSqli = ["'", "or ", "union", "select", "drop", "--", ";", "1=1", "1'='1"].some(kw =>
        query.toLowerCase().includes(kw)
    );

    // Detect if current query contains XSS syntax for visual indication
    const isXss = ["<script", "javascript:", "onerror=", "onload=", "<img", "alert(", "<svg", "<iframe"].some(kw =>
        query.toLowerCase().includes(kw)
    );

    return (
        <div className="vsearch-page">
            <div className="vsearch-blob vsblob1"></div>
            <div className="vsearch-blob vsblob2"></div>

            {/* Navbar */}
            <header className="vsearch-nav">
                <Link to="/lab" className="vsearch-logo">
                    <FaRocket />
                    <span>NovaSoft</span>
                </Link>
                <nav className="vsearch-navlinks">
                    <Link to="/lab">Home</Link>
                    <Link to="/lab/dashboard">Dashboard</Link>
                    <Link to="/lab/employees">Employees</Link>
                    <Link to="/lab/contact">Contact</Link>
                </nav>
                <div className="vsearch-nav-badge">
                    <FaShieldAlt /> Employee Directory & Search
                </div>
            </header>

            {/* Hero & Search Header */}
            <section className="vsearch-hero">
                <h1>Employee <span>Directory</span></h1>
                <p>Search NovaSoft staff by name, role, department, or user ID.</p>

                <form className="vsearch-bar" onSubmit={handleSearch}>
                    <FaSearch className="vsearch-bar-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or test queries (e.g. ' OR '1'='1')..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button type="button" className="vsearch-clear" onClick={clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                    <button type="submit" className="vsearch-submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>

                {/* Reflected Search Query Box (Vulnerable to Reflected XSS) */}
                {query && (
                    <div className="vsearch-reflection-box">
                        <span className="vsearch-reflection-label">Showing results for: </span>
                        <span
                            className="vsearch-reflection-content"
                            dangerouslySetInnerHTML={{ __html: query }}
                        />
                    </div>
                )}

                {/* Vulnerability Status Banners */}
                {isSqli && (
                    <div className="vsearch-sqli-alert">
                        <FaDatabase />
                        <div>
                            <strong>SQL Injection Detected (Database Filter Bypassed):</strong>
                            <p>Query <code>{query}</code> evaluated to TRUE. All employee records are dumped from the database.</p>
                        </div>
                    </div>
                )}

                {isXss && (
                    <div className="vsearch-xss-alert">
                        <FaExclamationTriangle />
                        <div>
                            <strong>Reflected Cross-Site Scripting (XSS) Triggered:</strong>
                            <p>Unescaped HTML/Script payload reflected directly into the DOM tree.</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Results Grid */}
            <section className="vsearch-results">
                <div className="vsearch-count">
                    {loading ? (
                        "Searching database records..."
                    ) : results.length > 0 ? (
                        <>
                            Found <strong>{results.length}</strong> employee record{results.length !== 1 ? "s" : ""}
                            {isSqli && " (SQL Injection Filter Bypassed)"}
                        </>
                    ) : (
                        "No employees found matching query."
                    )}
                </div>

                <div className="vsearch-grid">
                    {results.map((emp, index) => {
                        const empId = emp.id || emp._id || index + 1;
                        const fullName = emp.name || emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || "NovaSoft Employee";
                        const role = emp.role || emp.dept || "Staff";
                        const dept = emp.department || emp.dept || emp.company || "Engineering";
                        const salary = emp.salary || "₹8,50,000";

                        return (
                            <div key={empId || index} className="vsearch-card">
                                <div className="vsearch-avatar">
                                    {fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="vsearch-info">
                                    <h3>{fullName}</h3>
                                    <span className="vsearch-role">
                                        <FaBriefcase /> {role}
                                    </span>
                                    <span className="vsearch-dept">{dept}</span>

                                    <div className="vsearch-details">
                                        {emp.email && <div><FaEnvelope /> {emp.email}</div>}
                                        {emp.phone && <div><FaPhone /> {emp.phone}</div>}
                                        {emp.address && <div><FaMapMarkerAlt /> {emp.address}</div>}
                                        <div style={{ color: "#0B3C91", fontWeight: "700" }}>
                                            Salary: {salary}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/lab/employee/${empId}`}
                                        className="vsearch-profile-btn"
                                    >
                                        View Profile <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && results.length === 0 && (
                    <div className="vsearch-empty">
                        <FaUser />
                        <p>No employee records found. Try searching for "Smith", "John", or "' OR '1'='1".</p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="vsearch-footer">
                <p>© 2026 NovaSoft SaaS Enterprise Platform. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Search;
