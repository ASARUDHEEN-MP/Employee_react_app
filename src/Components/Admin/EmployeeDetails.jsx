import React, { useState, useEffect } from 'react';
import EmployeeView from './EmployeeView';
import './EmployeeDetails.css';
import axiosInstance from '../../../axios';
import { useMyContext } from '../../Context';

const EmployeeDetails = () => {
  const { token } = useMyContext();
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/Employees/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const employeeData = response.data.map(employee => ({
          ...employee,
          status: employee.is_active ? 'Active' : 'Blocked',
          position: employee.profile.position ? 
            (typeof employee.profile.position === 'object' ? employee.profile.position.id : employee.profile.position) :
            null,
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/positions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchEmployees();
    fetchPositions();
  }, [token]);

  const toggleStatus = async (id) => {
    const employee = employees.find(emp => emp.id === id);
    const newStatus = !employee.is_active;

    try {
      await axiosInstance.patch(`admin/Employees/${id}/`, {
        is_active: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, status: newStatus ? 'Active' : 'Blocked', is_active: newStatus } : emp
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axiosInstance.delete(`admin/Employees/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prev) => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = selectedPosition === 'All' || 
      (positions.find(pos => pos.title === selectedPosition)?.id === employee.position);
    return matchesSearch && matchesPosition;
  });

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleUpdate = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) => (employee.id === updatedEmployee.id ? updatedEmployee : employee))
    );
    setSelectedEmployee(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="employee-details">
      <h1>Employee Details</h1>
      
      <input
        type="text"
        placeholder="Search Employees"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      
      <select 
        value={selectedPosition}
        onChange={(e) => setSelectedPosition(e.target.value)}
        className="position-select"
      >
        <option value="All">All Positions</option>
        {positions.map((position) => (
          <option key={position.id} value={position.title}>
            {position.title}
          </option>
        ))}
      </select>
      
      {!selectedEmployee ? (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1 + indexOfFirstEmployee}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.status}</td>
                  <td>
                    {positions.find(pos => pos.id === employee.position)?.title || 'Unknown Position'}
                  </td>
                  <td>
                    <button 
                      className={`status-button ${employee.status === 'Active' ? 'block' : 'unblock'}`} 
                      onClick={() => toggleStatus(employee.id)}
                    >
                      {employee.status === 'Active' ? 'Block' : 'Unblock'}
                    </button>
                    <button 
                      className="view-button" 
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      View
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button 
                key={index + 1} 
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`} 
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <EmployeeView 
          employee={selectedEmployee} 
          onUpdate={handleUpdate} 
          onCancel={() => setSelectedEmployee(null)} 
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
