import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.css";
import api from "@/api/axiosInstance";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [toggleOpacity, setToggleOpacity] = useState(1);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth <= 767 && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                const toggleButton = document.querySelector('.sidebar-toggle-left');
                if (!toggleButton || !toggleButton.contains(event.target)) {
                    setSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    useEffect(() => {
        const sidebarEl = sidebarRef.current;
        if (!sidebarEl) return;

        const handleSidebarScroll = () => {
            setToggleOpacity(sidebarEl.scrollTop > 200 ? 0 : 1);
        };

        sidebarEl.addEventListener("scroll", handleSidebarScroll);
        return () => sidebarEl.removeEventListener("scroll", handleSidebarScroll);
    }, []);

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => setUserInfo(res.data))
            .catch(() => setUserInfo(null));
    }, []);

    return (
        <>
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} />

            <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Sidebar
                    ref={sidebarRef}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    toggleOpacity={toggleOpacity}
                    userInfo={userInfo}
                />
                <main className="dashboard-main">
                    <Outlet context={{ userInfo }} />
                </main>
            </div>
        </>
    );
};

export default DashboardLayout;
