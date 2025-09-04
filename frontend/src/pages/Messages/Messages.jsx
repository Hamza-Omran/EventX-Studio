import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import api from "@/api/axiosInstance";
import "./Messages.css";

const MessageItem = ({ message, currentUser }) => {
    const isOwn = message.from && currentUser && message.from === currentUser._id;
    
    return (
        <div
            className={`message-item${isOwn ? " own" : ""}`}
        >
            <div className="message-meta">
                <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <div className="message-content">
                {message.msg.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                        {line}
                        {idx < message.msg.split("\n").length - 1 ? <br /> : null}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const Messages = () => {
    const { userInfo } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sendError, setSendError] = useState("");
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === "admin") {
                api.get("/users").then(res => setUsers(res.data));
            } else {
                api.get("/admins").then(res => setUsers(res.data));
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (selectedUser) {
            api.get(`/messages/${selectedUser._id}`).then(res => setMessages(res.data));
        }
    }, [selectedUser]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const trimmedMsg = input.trim();
        if (!trimmedMsg || !selectedUser) return;
        try {
            const newMsg = {
                from: userInfo._id,
                to: selectedUser._id,
                msg: trimmedMsg,
            };
            const res = await api.post("/messages", newMsg);

            const msgObj = { ...res.data, from: res.data.from._id || res.data.from, to: res.data.to._id || res.data.to };
            setMessages([...messages, msgObj]);
            setInput("");
            setSendError("");
        } catch {
            setSendError("Sorry, couldn't send the message.");
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsUserListOpen(false);
    };

    return (
        <div className="messages-root">
            {}
            {isUserListOpen && <div className="messages-overlay" onClick={() => setIsUserListOpen(false)} />}

            <div className={`messages-users-list ${isUserListOpen ? 'open' : ''}`}>
                <div className="messages-users-header">
                    <h3>Users</h3>
                    <button
                        className="messages-toggle-btn desktop-hidden"
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                    >
                        ✕
                    </button>
                </div>
                {users.map(u => (
                    <div
                        key={u._id}
                        className={`messages-user${selectedUser?._id === u._id ? " selected" : ""}`}
                        onClick={() => handleUserSelect(u)}
                    >
                        {u.name}
                    </div>
                ))}
            </div>
            <div className="messages-chat-area">
                <div className="messages-chat-header-container">
                    <button
                        className="messages-toggle-btn mobile-only"
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                    >
                        ☰
                    </button>
                    {selectedUser ? (
                        <div className="messages-chat-header">Chat with {selectedUser.name}</div>
                    ) : (
                        <div className="messages-chat-header">Messages</div>
                    )}
                </div>
                {selectedUser ? (
                    <>
                        <div className="messages-list">
                            <div className="messages-wrapper">
                                {messages.map((msg, idx) => (
                                    <MessageItem key={idx} message={msg} currentUser={userInfo} />
                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </div>
                        <div className="messages-input-row">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your message..."
                                rows={2}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    } else if (e.key === "Enter" && e.shiftKey) {
                                        e.preventDefault();
                                        const textarea = e.target;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const newValue = input.slice(0, start) + "\n" + input.slice(end);
                                        setInput(newValue);
                                        setTimeout(() => {
                                            textarea.selectionStart = textarea.selectionEnd = start + 1;
                                        }, 0);
                                    }
                                }}
                            />
                            <button onClick={handleSend}>Send</button>
                        </div>
                        {sendError && <div className="messages-send-error">{sendError}</div>}
                    </>
                ) : (
                    <div className="messages-chat-placeholder">Select a user to start messaging</div>
                )}
            </div>
        </div>
    );
};
export default Messages;
