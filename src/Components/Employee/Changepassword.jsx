import React, { useState } from 'react';
import './ChangePassword.css';
import axiosInstance from '../../../axios'; // Make sure to import your axios instance
import { useMyContext } from '../../Context'; // Import context to access token
import Swal from 'sweetalert2'; // Import SweetAlert

const ChangePassword = () => {
    const { token, logout } = useMyContext(); // Get the token and logout function from context
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Password Mismatch',
                text: "New passwords do not match!",
            });
            return;
        }

        try {
            const response = await axiosInstance.put('change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: "Password changed successfully!",
            });

            // Log the user out for security reasons
            logout();

            // Optional: Redirect to login page after logout
            // navigate('/login'); // Uncomment this if using useNavigate

        } catch (error) {
            if (error.response) {
                // Handle the response error from the server
                const errorData = error.response.data;
                setErrorMessage(errorData.detail || 'An error occurred. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorMessage,
                });
            } else {
                // Handle any other errors (network, etc.)
                setErrorMessage('An unexpected error occurred. Please try again later.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorMessage,
                });
            }
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <form onSubmit={handleChangePassword} className="change-password-form">
                <div className="form-group">
                    <label>Old Password</label>
                    <div className="input-wrapper">
                        <input 
                            type={showOldPassword ? "text" : "password"} 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            required 
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowOldPassword(!showOldPassword)}>
                            {showOldPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-wrapper">
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit" className="change-password-button">Change Password</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
