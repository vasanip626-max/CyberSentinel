import React from "react";


import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";

import {

    FaUsers,
    FaProjectDiagram,
    FaDollarSign,
    FaTicketAlt,

    FaUserPlus,
    FaFolderPlus,
    FaEnvelope,
    FaChartBar

} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {



    const user = JSON.parse(localStorage.getItem("lab_user"));

    const stats = [

        {

            title: "Employees",

            value: "245",

            icon: <FaUsers />

        },

        {

            title: "Projects",

            value: "38",

            icon: <FaProjectDiagram />

        },

        {

            title: "Revenue",

            value: "$1.2M",

            icon: <FaDollarSign />

        },

        {

            title: "Tickets",

            value: "19",

            icon: <FaTicketAlt />

        }

    ];

    const projects = [

        {

            name: "CRM Migration",

            progress: "82%"

        },

        {

            name: "Cloud Dashboard",

            progress: "61%"

        },

        {

            name: "AI Analytics",

            progress: "48%"

        },

        {

            name: "Customer Portal",

            progress: "96%"

        }

    ];

    const news = [

        "Security Awareness Week",

        "HR Policy Updated",

        "Server Maintenance Friday",

        "Version 3.2 Released"

    ];

    const activity = [

        "John uploaded quarterly report",

        "Sarah created new project",

        "David deployed cloud server",

        "Emma updated employee records"

    ];
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Good Morning";
        } else if (hour < 17) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    const userName = user?.fullName || user?.firstName || user?.name || "";

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                {/* Welcome Section */}

                <div className="welcome-banner">

                    <h1>

                        {getGreeting()}{userName ? `, ${userName}` : ""} 👋

                    </h1>

                    <p>

                        Welcome back to NovaSoft Enterprise Platform.

                    </p>

                    <span>

                        Manage employees, projects and cloud resources from one centralized dashboard.

                    </span>

                </div>

                {/* Statistics */}

                <div className="stats-grid">

                    {

                        stats.map((item, index) => (

                            <div
                                key={index}
                                className="stat-card"
                            >

                                <div className="stat-icon">

                                    {item.icon}

                                </div>

                                <h2>

                                    {item.value}

                                </h2>

                                <p>

                                    {item.title}

                                </p>

                            </div>

                        ))

                    }

                </div>

                {/* Quick Actions */}

                <div className="quick-actions">

                    <button>

                        <FaUserPlus />

                        Add Employee

                    </button>

                    <button>

                        <FaFolderPlus />

                        New Project

                    </button>

                    <button>

                        <FaEnvelope />

                        Messages

                    </button>

                    <button>

                        <FaChartBar />

                        Reports

                    </button>

                </div>

                {/* Analytics */}

<div className="analytics-section">

    <div className="analytics-card">

        <h2>

            Monthly Performance

        </h2>

        <div className="chart">

            <div className="bar b1"></div>

            <div className="bar b2"></div>

            <div className="bar b3"></div>

            <div className="bar b4"></div>

            <div className="bar b5"></div>

            <div className="bar b6"></div>

        </div>

    </div>

    <div className="analytics-card">

        <h2>

            Server Status

        </h2>

        <div className="server-status">

            <div>

                <span className="green-dot"></span>

                API Server

            </div>

            <div>

                <span className="green-dot"></span>

                Database

            </div>

            <div>

                <span className="green-dot"></span>

                Authentication

            </div>

            <div>

                <span className="yellow-dot"></span>

                Email Service

            </div>

        </div>

    </div>

</div>

{/* Notifications & Meetings */}

<div className="info-section">

    <div className="info-card">

        <h2>

            Notifications

        </h2>

        <div className="notification-item">

            🔒 Password Policy Updated

        </div>

        <div className="notification-item">

            📢 Security Awareness Week Starts Monday

        </div>

        <div className="notification-item">

            ⚠ Server Maintenance Friday 10 PM

        </div>

        <div className="notification-item">

            ✅ CRM Deployment Successful

        </div>

    </div>

    <div className="info-card">

        <h2>

            Upcoming Meetings

        </h2>

        <div className="meeting-item">

            <strong>10:00 AM</strong>

            Development Sprint

        </div>

        <div className="meeting-item">

            <strong>1:30 PM</strong>

            Client Discussion

        </div>

        <div className="meeting-item">

            <strong>4:00 PM</strong>

            Cyber Security Review

        </div>

    </div>

</div>
{/* Recent Employees */}

<div className="employee-table">

    <div className="table-header">

        <h2>

            Recent Employees

        </h2>

        <button>

            View All

        </button>

    </div>

    <table>

        <thead>

            <tr>

                <th>Name</th>

                <th>Department</th>

                <th>Status</th>

                <th>Email</th>

            </tr>

        </thead>

        <tbody>

            <tr>

                <td>John Smith</td>

                <td>Development</td>

                <td>

                    <span className="status online">

                        Online

                    </span>

                </td>

                <td>john@novasoft.com</td>

            </tr>

            <tr>

                <td>Emily Johnson</td>

                <td>HR</td>

                <td>

                    <span className="status offline">

                        Offline

                    </span>

                </td>

                <td>emily@novasoft.com</td>

            </tr>

            <tr>

                <td>Michael Brown</td>

                <td>Cyber Security</td>

                <td>

                    <span className="status online">

                        Online

                    </span>

                </td>

                <td>michael@novasoft.com</td>

            </tr>

            <tr>

                <td>Sophia Wilson</td>

                <td>Finance</td>

                <td>

                    <span className="status away">

                        Away

                    </span>

                </td>

                <td>sophia@novasoft.com</td>

            </tr>

        </tbody>

    </table>

</div>

                {/* Dashboard Bottom */}

                <div className="dashboard-bottom">

                    <div className="dashboard-card">

    <h2>

        Recent Projects

    </h2>

    {

        projects.map((project, index) => (

            <div
                key={index}
                className="project-item"
            >

                <div className="project-header">

                    <span>

                        {project.name}

                    </span>

                    <strong>

                        {project.progress}

                    </strong>

                </div>

                <div className="progress-bar">

                    <div

                        className="progress-fill"

                        style={{

                            width: project.progress

                        }}

                    ></div>

                </div>

            </div>

        ))

    }

</div>

                    <div className="dashboard-card">

                        <h2>

                            Company News

                        </h2>

                        {

                            news.map((item, index) => (

                                <div
                                    key={index}
                                    className="list-item"
                                >

                                    {item}

                                </div>

                            ))

                        }

                    </div>

                    <div className="dashboard-card">

                        <h2>

                            Team Activity

                        </h2>

                        {

                            activity.map((item, index) => (

                                <div
                                    key={index}
                                    className="list-item"
                                >

                                    {item}

                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;