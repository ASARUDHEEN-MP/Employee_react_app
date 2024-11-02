import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css'; // Import the CSS for styling

function EmployeeDashboard() {
  const navigate = useNavigate();
  const profileView = () => {
    navigate('/Employee/profile');
  };

  return (
    <div className="employee-dashboard">
      <h1>Welcome to Your Dashboard!</h1>
      <p>We're glad to have you here. Feel free to explore your dashboard.</p>
      <button onClick={profileView} className="profile-button">View Profile</button>
    </div>
  );
}

export default EmployeeDashboard;
