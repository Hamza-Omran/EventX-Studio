import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "@/api/axiosInstance";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import "./Notifications.css";

const Notifications = () => {
    const { userInfo } = useOutletContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userInfo) {
            setLoading(true);
            api.get(`/messages/received`)
                .then(res => {
                    setMessages(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading notifications:', err);
                    setLoading(false);
                });
        }
    }, [userInfo]);

    return (
        <div className="notifications-root">
            <h2 className="notifications-title">Notifications</h2>
            <div className="notifications-list">
                {loading ? (
                    <div className="notifications-loading">
                        <LoadingDots />
                        <span>Loading notifications...</span>
                    </div>
                ) : messages.length === 0 ? (
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
