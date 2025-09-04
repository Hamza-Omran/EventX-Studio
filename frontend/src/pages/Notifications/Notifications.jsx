import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "@/api/axiosInstance";
import "./Notifications.css";

const Notifications = () => {
    const { userInfo } = useOutletContext();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (userInfo) {
            api.get(`/messages/received`).then(res => setMessages(res.data));
        }
    }, [userInfo]);

    return (
        <div className="notifications-root">
            <h2 className="notifications-title">Notifications</h2>
            <div className="notifications-list">
                {messages.length === 0 ? (
                    <div className="notifications-empty">No notifications yet.</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={msg._id || idx} className="notification-item">
                            <div className="notification-meta">
                                <span>From: {userInfo?.role === 'user' ? `(Admin) ${msg.from}` : msg.from}</span>
                                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="notification-content">
                                {msg.msg.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>{line}{i < msg.msg.split("\n").length - 1 ? <br /> : null}</React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default Notifications;
