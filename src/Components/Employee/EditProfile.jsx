import React from 'react';
import './EditProfile.css';
import { useMyContext } from '../../Context';

const EditProfile = ({ employeeData, onClose, onSave, positions }) => {
    const { token } = useMyContext();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            position: formData.get('position'),
            custom_fields: employeeData.custom_fields.map((field, index) => ({
                custom_field: field.custom_field_id, // Ensure this uses the correct field ID
                value: formData.get(`custom_field_${index}`) || '', // Default to empty if not filled
            })),
        };
    
        // Validate required fields
        const hasErrors = data.custom_fields.some(field => !field.value);
        if (!data.name || !data.email || !data.position || hasErrors) {
            alert('Please fill out all required fields.');
            return;
        }
    
        console.log('Submitting data:', data); // Inspect what you're submitting
        onSave(data);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Edit Profile</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            defaultValue={employeeData.name} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            defaultValue={employeeData.email} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <select 
                            name="position" 
                            defaultValue={employeeData.positionId} 
                            required
                        >
                            {positions.map(position => (
                                <option key={position.id} value={position.id}>
                                    {position.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {employeeData.custom_fields.map((field, index) => (
                        <div key={index} className="form-group">
                            <label>{field.field_name || `Unnamed Field`}</label>
                            <input
                                type={field.field_type || 'text'}
                                name={`custom_field_${index}`} 
                                defaultValue={field.value || ''} 
                                required={field.field_type === 'number'} // Set required if the field type is number
                            />
                        </div>
                    ))}

                    <div className="button-group">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
