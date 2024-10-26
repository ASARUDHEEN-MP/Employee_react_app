// src/components/UserDashboard.jsx

import {useEffect,useState} from 'react'
import EmployeeModule from '../Employee_managment/EmployeeModule';
import Settings from '../Employee_managment/Settings';
import './user_home.css';
import { useMyContext } from '../../Context';
import { useNavigate, NavLink,Outlet ,Link} from 'react-router-dom';


function UserDashboard() {
  const [activeTab, setActiveTab] = useState('employees');
  const { token, addToken,logout} = useMyContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log(token)
    // Check if email state is present, if not, navigate back to signup page
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    // Logic for logging out the user
    // For example, clear user data, redirect to login, etc.
    logout()
    navigate('/login');
    // Optionally, you can navigate to a login page
    // window.location.href = '/login'; // Uncomment if using simple redirect
  };

  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <nav className="dashboard-nav">
          <button 
            className={activeTab === 'employees' ? 'active' : ''}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button 
            className="logout-button" // Add a class for styling if needed
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="dashboard-content">
        {activeTab === 'employees' ? (
          <EmployeeModule />
        ) : (
          <Settings />
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
