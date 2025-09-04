import { useOutletContext } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
    const { userInfo } = useOutletContext();

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    if (userInfo.role !== requiredRole) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                textAlign: 'center',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                <h2>Access Denied</h2>
                <p>This page is not available.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
