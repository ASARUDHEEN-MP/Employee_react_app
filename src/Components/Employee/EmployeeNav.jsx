import React from 'react';
import './EmployeeNav.css'; // Import the CSS for styling
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyContext } from '../../Context';

const EmployeeNav = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const { logout } = useMyContext();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <h2 className="Employeedetails">Employee Dashboard</h2>
            <ul className="navList">
                <li 
                    className={`navItem ${location.pathname === '/Employee' ? 'active' : ''}`} 
                    onClick={() => navigate('/Employee')}
                >
                    <i className="fas fa-home"></i> Home
                </li>
                <li 
                    className={`navItem ${location.pathname === '/Employee/profile' ? 'active' : ''}`} 
                    onClick={() => navigate('/Employee/profile')}
                >
                    <i className="fas fa-user"></i> Profile
                </li>
                <li 
                    className={`navItem ${location.pathname === '/Employee/changepassword' ? 'active' : ''}`} 
                    onClick={() => navigate('/Employee/changepassword')}
                >
                    <i className="fas fa-key"></i> Change Password
                </li>
                <li className="navItem" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </li>
            </ul>
        </aside>
    );
};

export default EmployeeNav;
