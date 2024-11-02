import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useMyContext } from '../../Context';
import Swal from 'sweetalert2';
import axiosInstance from '../../../axios';



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { token, addToken, addRole, addUsername, addUserId } = useMyContext();

    // Check if the user is already logged in
    useEffect(() => {
        if (token) {
            // If the user is logged in, redirect based on role
            const role = localStorage.getItem('Role');
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'Employee') {
                navigate('/Employee'); // Adjust this if you have an employee route
            } else {
                navigate('/'); // Default redirect
            }
        }
    }, [token, navigate]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginRedirect = () => {
        navigate('/signup'); // Redirect to the signup page
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please enter both email and password.',
            });
            return;
        }

        try {
            const response = await axiosInstance.post('login/', {
                email,
                password,
            });
            
            
           
            addToken(response.data.token.access);
            addRole(response.data.user_role); // Set the role from the response
            addUserId(response.data.user_id); 
            

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Login successful!',
            });

            // Redirect based on user role
            if (response.data.user_role === 'admin') {
                navigate('/admin'); // Navigate to admin home page
            } else if (response.data.user_role === 'employee') {
                navigate('/employee'); // Navigate to employee home page
            } else {
                navigate('/'); // Default to home if role is not recognized
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: errorData.detail || 'Login failed. Please check your credentials and try again.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'An unexpected error occurred. Please try again later.',
                });
            }
        }
    };

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className='user-box'>
                        <input
                            type='email'
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
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            name='password'
                            autoComplete='current-password'
                        />
                        <label>Password</label>
                        <button type='button' onClick={toggleShowPassword} className='inv-spvw-btn'>
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <button type='submit' className='reg-log-btn'>Login</button>
                </form>
                <p className='loginbutton'>Don't have an account? <button onClick={handleLoginRedirect} className='login-button'>Signup</button></p>
            </div>
        </div>
    );
}

export default Login;
