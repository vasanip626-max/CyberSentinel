import React from "react";

function StatCard({ title, value, icon, color }) {

    return (

        <div
            className="stat-card"
            style={{
                borderTop: `4px solid ${color}`
            }}
        >

            <div className="stat-icon">

                <div
                    className="icon-circle"
                    style={{
                        background: color
                    }}
                >
                    {icon}
                </div>

            </div>

            <div className="stat-info">

                <h4>{title}</h4>

                <h2>{value}</h2>

            </div>

        </div>

    );

}

export default StatCard;