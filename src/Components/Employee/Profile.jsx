import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axios';
import './Profile.css';
import { useMyContext } from '../../Context';
import EditProfile from './EditProfile';

const Profile = () => {
    const { token, userId } = useMyContext();
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        positionId: '',
        positionTitle: '',
        custom_fields: [],
    });
    const [isModalOpen, setModalOpen] = useState(false);
    const [positions, setPositions] = useState([]);
    const [positionsLoaded, setPositionsLoaded] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const [profileImage, setProfileImage] = useState(''); // State to hold the profile image URL

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axiosInstance.get('http://127.0.0.1:8000/api/postion_view/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPositions(response.data);
                setPositionsLoaded(true);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, [token]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!positionsLoaded) return;

            try {
                const response = await axiosInstance.get(`Employee/${userId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;

                const positionTitle = positions.find(pos => pos.id === data.employeeprofile.position)?.title || '';

                setEmployeeData({
                    name: data.name,
                    email: data.email,
                    positionId: data.employeeprofile.position || '',
                    positionTitle: positionTitle,
                    custom_fields: data.custom_fields || [],
                });
                setProfileImage(data.employeeprofile.profile_image || ''); // Set initial profile image
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchEmployeeData();
    }, [positions, positionsLoaded, userId, token]);

    const handleEditClick = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSave = async (updatedData) => {
        try {
            const dataToUpdate = {
                name: updatedData.name,
                email: updatedData.email,
                employeeprofile: {
                    position: parseInt(updatedData.position, 10) || null,
                },
                custom_fields: updatedData.custom_fields.map(field => ({
                    custom_field: field.custom_field,
                    value: field.value,
                })),
            };

            console.log("Updating employee data:", JSON.stringify(dataToUpdate, null, 2));
        
            await axiosInstance.put(`Employee/${userId}/`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedPosition = positions.find(pos => pos.id === parseInt(updatedData.position, 10))?.title || '';

            setEmployeeData(prevData => ({
                ...prevData,
                name: updatedData.name,
                email: updatedData.email,
                positionId: updatedData.position,
                positionTitle: updatedPosition,
                custom_fields: updatedData.custom_fields.map(field => ({
                    custom_field_id: field.custom_field,
                    value: field.value,
                    field_name: prevData.custom_fields.find(f => f.custom_field_id === field.custom_field)?.field_name || '',
                    field_type: prevData.custom_fields.find(f => f.custom_field_id === field.custom_field)?.field_type || '',
                })),
            }));

            setModalOpen(false);
        } catch (error) {
            if (error.response) {
                console.error("Error updating employee data:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (!file) return; // If no file, exit
    
        const formData = new FormData();
        formData.append('profile_image', file);
    
        setLoading(true); // Show loading state
    
        // Use the employee profile ID for the URL instead of userId
        const employeeProfileId = employeeData.positionId; // Assuming this is the employee profile ID
    
        axiosInstance.put(`http://127.0.0.1:8000/api/profile_pic/${employeeProfileId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Image uploaded successfully', response.data);
            setProfileImage(response.data.profile_image); // Update profile image in state
            alert('Image uploaded successfully!');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.response?.data?.detail || 'An unexpected error occurred.'));
        })
        .finally(() => {
            setLoading(false); // Hide loading state
        });
    };
    
    return (
        <div className="profile-container">
            <div className="profile-image-container">
                <div className="image-placeholder">
                    <img 
                        src={profileImage || 'https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg?semt=ais_hybrid'} 
                        alt="Profile" 
                        className="profile-image" 
                    />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-icon">
                    <i className="fas fa-upload"></i>
                </label>
            </div>

            <div className="profile-info">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {employeeData.email || 'Please fill in your email'}</p>
                <p><strong>Name:</strong> {employeeData.name || 'Please fill in your name'}</p>
                <p><strong>Position:</strong> {employeeData.positionTitle || 'Please fill in your position'}</p>

                <h3>Additional Information</h3>
                {employeeData.custom_fields.length > 0 ? (
                    employeeData.custom_fields.map((field, index) => (
                        <p key={index}>
                            <strong>{field.field_name || 'Unnamed Field'}:</strong> {field.value || 'Please fill in this field'}
                        </p>
                    ))
                ) : (
                    <p>Oops, no additional fields.</p>
                )}
                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            </div>

            {isModalOpen && (
                <EditProfile 
                    employeeData={employeeData} 
                    onClose={handleCloseModal} 
                    onSave={handleSave} 
                    positions={positions}
                />
            )}
        </div>
    );
};

export default Profile;
