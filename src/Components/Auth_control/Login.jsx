import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useMyContext } from '../../Context';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
// action with the context
  const { token, addToken } = useMyContext();
  useEffect(() => {
    // Check if the user is already authenticated
    
    if (token){
      
      navigate('/');
    }
  }, [token, navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginRedirect = () => {
    // Redirect to the login page (adjust the path as necessary)
    window.location.href = '/signup'; // Replace with your actual login route
};

const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages

    // Validate input before making the request (optional)
    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please enter both email and password.',
        });
        return;
    }

    try {
        const response = await fetch('http://13.54.219.41/auth/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            addToken(data.token.access);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Login successful!',
            });
            navigate('/'); // Navigate to homepage
        } else {
            // Server responded with an error
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorData.detail || 'Login failed. Please check your credentials and try again.',
            });
        }
    } catch (error) {
        // Handle network or unexpected errors
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An unexpected error occurred. Please try again later.',
        });
    }
};



  return (
    <div className='login-box'>
      <h2>Login</h2>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
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

        <button type='submit' className='reg-log-btn'>Signup</button>
      </form>
      <p className='loginbutton'>Register an account? <button onClick={handleLoginRedirect} className='login-button'>Signup</button></p>
    </div>
  );
}

export default Login;
