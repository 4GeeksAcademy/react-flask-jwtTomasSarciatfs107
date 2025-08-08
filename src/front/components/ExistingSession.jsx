import { Navigate, Outlet } from 'react-router-dom';

const ExistingSession = () => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default ExistingSession;