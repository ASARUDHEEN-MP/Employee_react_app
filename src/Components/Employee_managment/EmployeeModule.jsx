import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeDetailModal from './EmployeeDetailModal';
import { useMyContext } from '../../Context';
import Loading from '../Loading/Loading'; // Importing the Loading component
import './EmployeeModule.css';

function EmployeeModule() {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', phone: '', email: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const { token } = useMyContext();

  // Loading state
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://13.54.219.41/employee/api/employees/?search=${search}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch employees:', errorData);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEmployees();
  }, [search, token]);

  // Fetch custom fields
  useEffect(() => {
    const fetchCustomFields = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('http://13.54.219.41/employee/api/custom-fields/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCustomFields(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch custom fields:', errorData);
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCustomFields();
  }, [token]);

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const displayedEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const addEmployee = (newEmp) => {
    setEmployees([...employees, newEmp]);
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://13.54.219.41/employee/api/employees/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEmployees(employees.filter(emp => emp.id !== id));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete employee:', errorData);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const updateEmployee = async (updatedEmployee) => {
    try {
      const response = await fetch(`http://13.54.219.41/employee/api/employees/${updatedEmployee.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        setEmployees(employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
      } else {
        const errorData = await response.json();
        console.error('Failed to update employee:', errorData);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const viewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="employee-module">
      <h2>Employee List</h2>
      <input
        type="text"
        placeholder="Search Employees"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <button className="add-employee-button" onClick={() => setIsModalOpen(true)}>
        Add Employee
      </button>

      {loading ? ( // Show Loading component
        <Loading />
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              {customFields.map(field => (
                <th key={field.id}>{field.field_name}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.email}</td>
                {customFields.map(field => (
                  <td key={field.id}>
                    {employee.custom_fields && employee.custom_fields[field.field_name] 
                      ? employee.custom_fields[field.field_name] 
                      : 'None'}
                  </td>
                ))}
                <td>
                  <button onClick={() => viewEmployee(employee)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button 
          className="page-button" 
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index} 
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`} 
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button 
          className="page-button" 
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <EmployeeModal 
          onClose={() => setIsModalOpen(false)} 
          newEmployee={newEmployee}
          setNewEmployee={setNewEmployee}
          onAdd={addEmployee}
          customFields={customFields} 
        />
      )}

      {isDetailModalOpen && selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={(id) => deleteEmployee(id)}
          onUpdate={updateEmployee}
          customFields={customFields}
        />
      )}
    </div>
  );
}

export default EmployeeModule;
