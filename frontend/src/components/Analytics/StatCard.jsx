import React from "react";
import './StatCard.css'

const StatCard = ({ title, value, icon }) => (
    <div className="stat-card" key={title}>
        <div className="stat-card-label-row">
            <span className="stat-card-label">{title}</span>
            <span className="stat-card-icon">{icon}</span>
        </div>
        <div className="stat-card-value">{value}</div>
    </div>
);

export default StatCard;
