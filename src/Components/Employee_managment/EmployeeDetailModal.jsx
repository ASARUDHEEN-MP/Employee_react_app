import React, { useState, useEffect } from 'react';
import './EmployeeDetailModal.css';

function EmployeeDetailModal({ employee, onClose, onDelete, onUpdate, customFields }) {
  const [editableEmployee, setEditableEmployee] = useState(employee);

  useEffect(() => {
    setEditableEmployee(employee); // Update state when employee prop changes
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableEmployee((prev) => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [name]: value,
      },
    }));
  };

  const handleUpdate = () => {
    onUpdate(editableEmployee);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Employee</h2>
        <div className="modal-field">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editableEmployee.name}
            onChange={handleChange}
          />
        </div>
        <div className="modal-field">
          <label>Phone:</label>
          <input
            type="text"
            name="phone_number"
            value={editableEmployee.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="modal-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editableEmployee.email}
            onChange={handleChange}
          />
        </div>
        
        {/* Render custom fields */}
        {customFields.map(field => (
          <div className="modal-field" key={field.id}>
            <label>{field.field_name}:</label>
            <input
              type="text"
              name={field.field_name} // Use field name as the input name
              value={editableEmployee.custom_fields[field.field_name] || ''} // Show current value or empty
              onChange={handleCustomFieldChange}
            />
          </div>
        ))}

        <div className="modal-actions">
          <button className="btn update-btn" onClick={handleUpdate}>Update</button>
          <button className="btn delete-btn" onClick={() => { onDelete(employee.id); onClose(); }}>Delete</button>
          <button className="btn close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailModal;
