import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
    FaRocket,
    FaTachometerAlt,
    FaUsers,
    FaProjectDiagram,
    FaSearch,
    FaEnvelope,
    FaChartBar,
    FaCog,
    FaUserShield,
    FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("lab_user") || "{}");
    const isAdmin = user?.role === "Admin" || user?.email === "admin@gmail.com";

    const menus = [
        {
            name: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/lab/dashboard"
        },
        {
            name: "Employees",
            icon: <FaUsers />,
            path: "/lab/employees"
        },
        {
            name: "Projects",
            icon: <FaProjectDiagram />,
            path: "/lab/projects"
        },
        {
            name: "Search",
            icon: <FaSearch />,
            path: "/lab/search"
        },
        {
            name: "Messages",
            icon: <FaEnvelope />,
            path: "/lab/messages"
        },
        {
            name: "Reports",
            icon: <FaChartBar />,
            path: "/lab/reports"
        },
        {
            name: "Settings",
            icon: <FaCog />,
            path: "/lab/settings"
        },
        ...(isAdmin ? [{
            name: "Admin Panel",
            icon: <FaUserShield />,
            path: "/lab/admin"
        }] : [])
    ];

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <FaRocket />

                <span>NovaSoft</span>

            </div>

            <div className="sidebar-menu">

                {

                    menus.map((item) => (

                        <Link

                            key={item.name}

                            to={item.path}

                            className={
                                location.pathname === item.path
                                    ? "menu-item active"
                                    : "menu-item"
                            }

                        >

                            {item.icon}

                            <span>{item.name}</span>

                        </Link>

                    ))

                }

            </div>

            <button
                className="logout-btn"
                onClick={() => {

                    localStorage.removeItem("lab_user");
                    localStorage.removeItem("lab_token");

                    window.location.href = "/lab/login";

                }}
            >

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

}

export default Sidebar;