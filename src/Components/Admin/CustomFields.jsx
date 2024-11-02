import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Import your axios instance
import { useMyContext } from '../../Context'; // Import context to access token
import './CustomFields.css';

const CustomFields = () => {
  const { token } = useMyContext(); // Get the token from context
  const [customFields, setCustomFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]); // State for field types
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text'); // Default to lowercase 'text'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set to 10 for pagination
  const [error, setError] = useState(null); // State to capture errors

  useEffect(() => {
    fetchCustomFields();
    fetchFieldTypes(); // Fetch field types on component mount
  }, []);

  const fetchCustomFields = async () => {
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/custom_fields/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomFields(response.data);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    }
  };

  const fetchFieldTypes = async () => {
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/field_types/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFieldTypes(response.data);
    } catch (error) {
      console.error('Error fetching field types:', error);
    }
  };

  const addCustomField = async () => {
    if (newFieldName) {
      try {
        const response = await axiosInstance.post('http://127.0.0.1:8000/api/admin/custom_fields/', {
          field_name: newFieldName,
          field_type: newFieldType,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update state with the new custom field
        setCustomFields([...customFields, response.data]);
        setNewFieldName('');
        setNewFieldType('text'); // Reset to default type
        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.response?.data?.detail || 'Error adding custom field'); // Capture error message
        console.error('Error adding custom field:', error);
      }
    }
  };

  const deleteCustomField = async (id) => {
    try {
      await axiosInstance.delete(`http://127.0.0.1:8000/api/admin/custom_fields/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomFields(customFields.filter(field => field.id !== id));
    } catch (error) {
      console.error('Error deleting custom field:', error);
    }
  };

  const filteredFields = customFields.filter(field =>
    field.field_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastField = currentPage * itemsPerPage;
  const indexOfFirstField = indexOfLastField - itemsPerPage;
  const currentFields = filteredFields.slice(indexOfFirstField, indexOfLastField);
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="custom-fields">
      <h1>Custom Fields</h1>
      
      {error && <div className="error-message">{error}</div>} {/* Display error message */}

      <div className="add-field-form">
        <input
          type="text"
          placeholder="Custom Field Name"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          className="field-input"
        />
        <select 
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value)}
          className="field-select"
        >
          {fieldTypes.map((type) => (
            <option key={type[0]} value={type[0]}>
              {type[1]} {/* Display the human-readable type */}
            </option>
          ))}
        </select>
        <button onClick={addCustomField} className="add-button">Add Field</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="small-search-input"
        />
      </div>

      <table className="custom-fields-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFields.map((field, index) => (
            <tr key={field.id}>
              <td>{index + 1 + indexOfFirstField}</td> {/* Display order number */}
              <td>{field.field_name}</td>
              <td>{field.field_type}</td>
              <td>
                <button onClick={() => deleteCustomField(field.id)} className="delete-button">Delete</button>
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
    </div>
  );
};

export default CustomFields;
