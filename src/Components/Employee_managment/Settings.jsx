import React, { useState, useEffect } from 'react';
import Loading from '../Loading/Loading'; // Import your Loading component
import './Setting.css';

function Settings() {
    const [fields, setFields] = useState([]);
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');
    
    // Loading state
    const [loading, setLoading] = useState(true);

    // Fetch existing fields on component mount
    useEffect(() => {
        const fetchFields = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch('http://13.54.219.41/employee/api/custom-fields/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust if needed
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setFields(data);
            } catch (error) {
                console.error('Error fetching custom fields:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchFields();
    }, []);

    const addField = async () => {
        if (!newFieldLabel) return;

        const newField = {
            field_name: newFieldLabel,
            field_type: newFieldType,
        };

        try {
            const response = await fetch('http://13.54.219.41/employee/api/custom-fields/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust if needed
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newField),
            });

            if (!response.ok) {
                throw new Error('Failed to add custom field');
            }

            const data = await response.json();
            setFields([...fields, data]);
            setNewFieldLabel('');
            setNewFieldType('text');
        } catch (error) {
            console.error('Error adding custom field:', error);
        }
    };

    const removeField = async (id) => {
        try {
            const response = await fetch(`http://13.54.219.41/employee/api/custom-fields/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust if needed
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove custom field');
            }

            setFields(fields.filter(field => field.id !== id));
        } catch (error) {
            console.error('Error removing custom field:', error);
        }
    };

    return (
        <div className="settings-module">
            <h2>Settings</h2>
            <h3>Manage Employee Fields</h3>
            {loading ? ( // Show loading component
                <Loading />
            ) : (
                <>
                    <div className="field-management">
                        <input
                            type="text"
                            placeholder="Field Label"
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            className="input-field"
                        />
                        <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)} className="select-field">
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            {/* Add more input types as needed */}
                        </select>
                        <button onClick={addField} className="add-field-button">Add Field</button>
                    </div>

                    <h4>Existing Fields</h4>
                    <ul className="field-list">
                        {fields.map(field => (
                            <li key={field.id} className="field-item">
                                {field.field_name} ({field.field_type}) 
                                <button className="remove-field" onClick={() => removeField(field.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default Settings;
