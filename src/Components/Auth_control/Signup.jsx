import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./Signup.css";
import Swal from 'sweetalert2';
import axiosInstance from '../../../axios';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showReenterPassword, setShowReenterPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password validation state
    const [isValidLength, setIsValidLength] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasDigit, setHasDigit] = useState(false);
    
    const navigate = useNavigate(); // Initialize useNavigate

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowReenterPassword = () => {
        setShowReenterPassword(!showReenterPassword);
    };

    const validatePassword = (pwd) => {
        setIsValidLength(pwd.length >= 6);
        setHasUppercase(/[A-Z]/.test(pwd));
        setHasDigit(/[0-9]/.test(pwd));
    };

    const handleLoginRedirect = () => {
        window.location.href = '/login'; // Adjust the path as necessary
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== reenterPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('register/', {
                name,
                email,
                password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Signup successful!',
            });

            // Use navigate to go to the login page
            navigate('/login'); // Ensure this is properly set
        } catch (error) {
            console.log(error.response.data);
            if (error.response) {
                const errorData = error.response.data;
                if (error.response.status === 400) {
                    let errorMessage = '';
                    if (errorData.password) {
                        errorMessage += errorData.password.join(' ');
                    }
                    if (errorData.email) {
                        errorMessage += (errorMessage ? ' ' : '') + errorData.email[0];
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: errorMessage || 'Signup failed',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'An error occurred. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signup-container'>
            <div className='login-box'>
                <p>Signup</p>
                <form onSubmit={handleSubmit}>
                    <div className='user-box'>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            name='name'
                            autoComplete='name'
                        />
                        <label>Name</label>
                    </div>

                    <div className='user-box'>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            name='email'
                            autoComplete='email'
                        />
                        <label>Email</label>
                    </div>

                    <div className='user-box'>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value); // Validate on change
                            }}
                            required
                            name='password'
                            autoComplete='current-password'
                        />
                        <label>Password</label>
                        <button type="button" onClick={toggleShowPassword} className='inv-spvw-btn'>
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <div className='user-box'>
                        <input
                            type={showReenterPassword ? "text" : "password"}
                            value={reenterPassword}
                            onChange={(e) => setReenterPassword(e.target.value)}
                            required
                            name='reenterPassword'
                            autoComplete='new-password'
                        />
                        <label>Re-enter Password</label>
                        <button type="button" onClick={toggleShowReenterPassword} className='inv-spvw-btn'>
                            {showReenterPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <div className="validation-indicators">
                            <div className="indicator-group">
                                <span className={`indicator ${isValidLength ? 'valid' : 'invalid'}`}>
                                    {isValidLength ? '✔️' : '❌'}
                                </span>
                                <span className="indicator-text">At least 6 characters</span>
                            </div>
                            
                            <div className="indicator-group">
                                <span className={`indicator ${hasUppercase ? 'valid' : 'invalid'}`}>
                                    {hasUppercase ? '✔️' : '❌'}
                                </span>
                                <span className="indicator-text">At least one uppercase letter</span>
                            </div>
                            
                            <div className="indicator-group">
                                <span className={`indicator ${hasDigit ? 'valid' : 'invalid'}`}>
                                    {hasDigit ? '✔️' : '❌'}
                                </span>
                                <span className="indicator-text">At least one digit</span>
                            </div>
                        </div>
                    </div>

                    <button type='submit' className='reg-log-btn' disabled={loading || !(isValidLength && hasUppercase && hasDigit)}>
                        {loading ? 'Loading...' : 'SIGN UP'}
                    </button>
                </form>
                <p className='loginbutton'>Already have an account? <button onClick={handleLoginRedirect} className='login-button'>Login</button></p>
            </div>
        </div>
    );
}

export default Signup;
