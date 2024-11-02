import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './EmployeeHome.css'; // Import CSS for styling
import EmployeeNav from './EmployeeNav';
import Profile from './Profile';
import Changepassword from './Changepassword';
import { useMyContext } from '../../Context';
import Employee_dashboard from './Employee_dashboard';
 


function EmployeeHome() {
    const navigate = useNavigate();


    return (
        <div className="admin-container">
            <EmployeeNav /> {/* Include the AdminNav component */}
            <div className="main-content">
                <Routes>
                <Route index element={< Employee_dashboard/>} /> {/* Default content when navigating to /admin */}
                <Route path="profile" element={<Profile />} /> {/* Employee data */}
                <Route path="changepassword" element={<Changepassword />} />
                
                {/* Add more routes as needed */}
                </Routes>
            </div>
    </div>
    );
}

export default EmployeeHome;
