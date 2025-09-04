import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DashboardRedirect = () => {
    const navigate = useNavigate();
    const { userInfo } = useOutletContext() || {};

    useEffect(() => {
        if (userInfo?.role === "admin") {
            navigate("/dashboard/admin-main-page");
        } else if (userInfo?.role === "user") {
            navigate("/dashboard/events");
        }
    }, [userInfo, navigate]);

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh",
            fontSize: "1.2rem",
            color: "#666"
        }}>
            Redirecting...
        </div>
    );
};

export default DashboardRedirect;