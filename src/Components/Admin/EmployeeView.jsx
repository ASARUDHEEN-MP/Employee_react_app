import React, { useState, useEffect } from 'react';
import './EmployeeView.css';
import axiosInstance from '../../../axios';
import { useMyContext } from '../../Context';

function EmployeeView({ employee, onCancel }) {
  const [formData] = useState({ ...employee });
  const [customField, setCustomField] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState([]);
  const [showCustomFieldInput, setShowCustomFieldInput] = useState(false);
  const [availableCustomFields, setAvailableCustomFields] = useState([]);
  const { token } = useMyContext();

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/custom_fields/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCustomFields(response.data);
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      }
    };

    const fetchCustomFieldValues = async () => {
      try {
        const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admin/custom_fields_value/?user_id=${formData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomFieldValues(response.data);
      } catch (error) {
        console.error('Error fetching custom field values:', error);
      }
    };

    fetchCustomFields();
    fetchCustomFieldValues();
  }, [token, formData.id]);

  const addCustomField = async () => {
    if (customField) {
      const selectedField = availableCustomFields.find(field => field.field_name === customField);
      if (selectedField) {
        try {
          const newFieldValue = {
            user: formData.id,
            custom_field_id: selectedField.id,
            value: '',
          };
          const response = await axiosInstance.post('http://127.0.0.1:8000/api/admin/custom_fields_value/', newFieldValue, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCustomFieldValues(prevValues => [...prevValues, response.data]);
          setCustomField('');
          setShowCustomFieldInput(false);
        } catch (error) {
          console.error('Error adding custom field:', error);
        }
      }
    }
  };

  const handleCustomFieldChange = (e) => setCustomField(e.target.value);

  const removeCustomField = async (id) => {
    try {
      await axiosInstance.delete(`http://127.0.0.1:8000/api/admin/custom_fields_value/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomFieldValues(prevValues => prevValues.filter(fieldValue => fieldValue.id !== id));
    } catch (error) {
      console.error('Error deleting custom field:', error);
    }
  };

  return (
    <div className="employee-detail">
      <h2 className="employee-name">{formData.name}</h2>
      <div className="employee-info">
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Status:</strong> {formData.status}</p>
        <p><strong>Position:</strong> {formData.profile?.position?.title || 'Unknown Position'}</p>

        <div className="custom-fields">
          <h3>Custom Fields</h3>
          {customFieldValues.length > 0 ? (
            <table className="custom-fields-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Data</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customFieldValues.map(fieldValue => (
                  <tr key={fieldValue.id}>
                    <td>{fieldValue.custom_field.field_name}</td>
                    <td>{fieldValue.value}</td>
                    <td>
                      <button className="remove-button" onClick={() => removeCustomField(fieldValue.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-fields">No custom fields values found.</p>
          )}
        </div>

        {showCustomFieldInput && (
          <div className="add-custom-field-container">
            <select value={customField} onChange={handleCustomFieldChange} className="field-select">
              <option value="">Select Field</option>
              {availableCustomFields.map(field => (
                <option key={field.id} value={field.field_name}>{field.field_name}</option>
              ))}
            </select>
            <button className="add-custom-field" onClick={addCustomField}>Add</button>
          </div>
        )}

        <div className="button-group">
          <button className="toggle-button" onClick={() => setShowCustomFieldInput(true)}>Add Field</button>
          <button className="back-button" onClick={onCancel}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeView;
