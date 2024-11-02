import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from './AdminNav'; // Import the AdminNav component
import EmployeeDetails from './EmployeeDetails'; // Import EmployeeDetails component
import CustomFields from './CustomFields'; // Import CustomFields component
import './AdminHomePage.css'; // Import the CSS for styling
import Positions from './Positions';

function AdminHomePage() {
  return (
    <div className="admin-container">
      <AdminNav /> {/* Include the AdminNav component */}
      <div className="main-content">
        <Routes>
          <Route index element={<EmployeeDetails />} /> {/* Default content when navigating to /admin */}
          <Route path="customfields" element={<CustomFields />} /> {/* Employee data */}
          <Route path="positions" element={<Positions />} />
         
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default AdminHomePage;
