import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is authenticated
    if (!token || !user.role) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role (if specified)
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = user.role === 'admin' ? '/dashboard/admin-main-page' : '/dashboard/events';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;