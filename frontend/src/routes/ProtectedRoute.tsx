import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    // If token exists, we consider them authenticated.
    // Real validation happens on the API side (axios interceptor will log them out if invalid)
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};
