import React, { useState } from 'react';
import './AdminNav.css'; 
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../../Context';

function AdminNav() {
  const navigate = useNavigate();
  const { logout } = useMyContext();
  
  // State to track the active navigation item
  const [activeItem, setActiveItem] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setActiveItem(path); // Set the active item
    navigate(path); // Navigate to the selected path
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">Admin Dashboard</h2>
      <ul className="navList">
        <li 
          className={`navItem ${activeItem === '/admin' ? 'active' : ''}`} 
          onClick={() => handleNavigation('/admin')}
        >
          <i className="fas fa-home navIcon"></i> Home
        </li>
        <li 
          className={`navItem ${activeItem === '/admin/customfields' ? 'active' : ''}`} 
          onClick={() => handleNavigation('/admin/customfields')}
        >
          <i className="fas fa-cog navIcon"></i> Manage Custom Fields
        </li>
        <li 
          className={`navItem ${activeItem === '/admin/positions' ? 'active' : ''}`} 
          onClick={() => handleNavigation('/admin/positions')}
        >
          <i className="fas fa-users navIcon"></i> Manage Position Fields
        </li>
        <li 
          className={`navItem`} 
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt navIcon"></i> Logout
        </li>
      </ul>
    </aside>
  );
}

export default AdminNav;
