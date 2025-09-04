import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const DashboardRedirect = () => {
    const { userInfo } = useOutletContext();

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    if (userInfo.role === "admin") {
        return <Navigate to="admin-main-page" replace />;
    } else {
        return <Navigate to="events" replace />;
    }
};

export default DashboardRedirect;
