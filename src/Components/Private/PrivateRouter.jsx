import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMyContext } from '../../Context';

const Privateroute = () => {
    const { token } = useMyContext();
    const storedToken = localStorage.getItem("token");
    
    const isAuthenticated =token||storedToken;
    
    return isAuthenticated?<Outlet/>:<Navigate to='/login' replace />
}

export default Privateroute;
