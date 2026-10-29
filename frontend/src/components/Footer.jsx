import React from "react";
import { FaShieldAlt, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {

    const year = new Date().getFullYear();

    return (

        <footer className="dashboard-footer">

            <div className="footer-left">

                <FaShieldAlt className="footer-logo"/>

                <div>

                    <h3>Cyber Sentinel</h3>

                    <p>AI Powered Threat Detection Platform</p>

                </div>

            </div>

            <div className="footer-center">

                <p>

                    © {year} Cyber Sentinel.

                    All Rights Reserved.

                </p>

            </div>

            <div className="footer-right">

                <a href="#">

                    <FaGithub/>

                </a>

                <a href="#">

                    <FaLinkedin/>

                </a>

                <a href="#">

                    <FaEnvelope/>

                </a>

            </div>

        </footer>

    );

}

export default Footer;