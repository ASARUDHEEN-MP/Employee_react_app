import React from 'react';
import { useMyContext } from '../../Context';
import './EmployeeModal.css';

function EmployeeModal({ onClose, newEmployee, setNewEmployee, onAdd, customFields = [] }) {
  const { token } = useMyContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create an object to hold custom fields
    const customFieldData = {};
    
    // Populate customFieldData with values from newEmployee
    customFields.forEach(field => {
      customFieldData[field.field_name] = newEmployee[field.field_name] || '';
    });
  
    try {
      const response = await fetch('http://13.54.219.41/employee/api/employees/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          phone_number: newEmployee.phone,
          custom_fields: customFieldData, // Send the custom fields as an object
        }),
      });
  
      if (response.ok) {
        const addedEmployee = await response.json();
        onAdd(addedEmployee);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to add employee:', errorData);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Employee</h2>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
            />
          </div>
          <div className="modal-field">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              required
            />
          </div>
          <div className="modal-field">
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              required
            />
          </div>
          {/* Render custom fields dynamically */}
          {customFields.map(field => (
            <div key={field.id} className="modal-field">
              <label>{field.field_name}:</label>
              <input
                type={field.field_type}
                placeholder={`Enter ${field.field_name}`}
                value={newEmployee[field.field_name] || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, [field.field_name]: e.target.value })}
                required={field.field_type === 'text'}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit" className="btn add-button">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeModal;
