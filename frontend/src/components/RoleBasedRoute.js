import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
};

export default RoleBasedRoute;
