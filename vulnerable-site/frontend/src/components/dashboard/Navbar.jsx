import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaBell,
    FaUserCircle
} from "react-icons/fa";

import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("lab_user") || "{}");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/lab/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="navbar">
            <form onSubmit={handleSearchSubmit} className="search-box">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search employees, projects (press Enter)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <div className="navbar-right">
                <div className="notification">
                    <FaBell />
                    <span className="notification-dot"></span>
                </div>

                <div className="user-profile">
                    <FaUserCircle className="avatar"/>
                    <div>
                        <h4>
                            {user?.fullName || user?.name || "NovaSoft User"}
                        </h4>
                        <p>
                            {user?.email || "user@novasoft.com"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;