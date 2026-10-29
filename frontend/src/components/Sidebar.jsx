import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaShieldAlt,
    FaBroadcastTower,
    FaBug,
    FaRobot,
    FaFileAlt,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar({ activeId: propActiveId, setActiveId: propSetActiveId }) {

    const navigate = useNavigate();
    const [localActiveId, setLocalActiveId] = useState(1);

    const activeId = propActiveId !== undefined ? propActiveId : localActiveId;
    const setActiveId = propSetActiveId || setLocalActiveId;

    const menuItems = [

        { id: 1, title: "Dashboard",       icon: <FaTachometerAlt /> },
        { id: 2, title: "Threat Detection", icon: <FaShieldAlt /> },
        { id: 3, title: "Live Monitor",    icon: <FaBroadcastTower /> },
        { id: 4, title: "Attack Logs",     icon: <FaBug /> },
        { id: 5, title: "AI Analysis",     icon: <FaRobot /> },
        { id: 6, title: "Reports",         icon: <FaFileAlt /> },
        { id: 7, title: "Settings",        icon: <FaCog /> }

    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        navigate("/login");
    };

    return (

        <aside className="sidebar">

            <div>

                <div className="sidebar-logo">

                    <FaShieldAlt className="sidebar-logo-icon" />

                    <h2>CYBER</h2>

                </div>

                <div className="sidebar-menu">

                    {menuItems.map((item) => (

                        <div
                            key={item.id}
                            className={`menu-item ${activeId === item.id ? "active" : ""}`}
                            onClick={() => setActiveId(item.id)}
                        >

                            {item.icon}

                            <span>{item.title}</span>

                        </div>

                    ))}

                </div>

            </div>

            <div className="sidebar-bottom">

                <button className="sidebar-logout" onClick={handleLogout}>

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;