import React from "react";
import {
  FiHome,
  FiFolder,
  FiUser,
  FiMail,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>

        <div>
          <h2>NovaSoft</h2>
          <p>Workspace</p>
        </div>
      </div>

      <nav className="sidebar-menu">

        <a href="/app" className="active">
          <FiHome />
          <span>Dashboard</span>
        </a>

        <a href="/projects">
          <FiFolder />
          <span>Projects</span>
        </a>

        <a href="/profile">
          <FiUser />
          <span>Profile</span>
        </a>

        <a href="/support">
          <FiMail />
          <span>Support</span>
        </a>

        <a href="/settings">
          <FiSettings />
          <span>Settings</span>
        </a>

      </nav>

      <div className="sidebar-bottom">

        <button className="logout-btn">
          <FiLogOut />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;