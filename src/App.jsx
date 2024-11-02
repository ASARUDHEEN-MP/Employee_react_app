import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Auth_control/Login';
import Signup from './Components/Auth_control/Signup';
import { Context } from './Context';
import PrivateRoute from './PrivateRoute';
import AdminHomePage from './Components/Admin/AdminHomePage';
import Employee_home from './Components/Employee/Employee_home';
import CustomFields from './Components/Admin/CustomFields';
import EmployeeDetails from './Components/Admin/EmployeeDetails';
import Positions from './Components/Admin/Positions';
import Profile from './Components/Employee/Profile';
import Changepassword from './Components/Employee/Changepassword';
import Employee_dashboard from './Components/Employee/Employee_dashboard';
import EditProfile from './Components/Employee/EditProfile';

function App() {
  return (
    <Context>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        
        {/* Protected Admin Routes */}
        <Route path='/admin' element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route element={<AdminHomePage />}> {/* Wrap AdminHomePage around routes */}
            <Route index element={<EmployeeDetails />} /> {/* Default content */}
            <Route path="customfields" element={<CustomFields />} /> {/* Employee data */}
            <Route path="positions" element={<Positions />} />
            {/* Additional admin routes can be added here */}
          </Route>
        </Route>

        {/* Protected Employee Routes */}
        <Route path='/Employee' element={<PrivateRoute allowedRoles={['Employee']} />}>
            <Route element={<Employee_home />}> 
                  <Route index element={<Employee_dashboard/>} />
                  <Route path="profile" element={<Profile />} /> 
                  <Route path="changepassword" element={<Changepassword />} /> 
              {/* Additional employee routes */}
              </Route>
        </Route>

        {/* Redirect to login if no valid route found */}
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Context>
  );
}

export default App;
