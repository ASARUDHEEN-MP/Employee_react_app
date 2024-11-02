import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMyContext } from './Context';

const PrivateRoute = ({ allowedRoles }) => {
    const { token, role } = useMyContext();
    const isAuthorized = token && allowedRoles.includes(role);

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
