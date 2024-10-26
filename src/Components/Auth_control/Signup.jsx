import { useState } from 'react';
import "./Signup.css";
import Swal from 'sweetalert2';


function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showReenterPassword, setShowReenterPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowReenterPassword = () => {
        setShowReenterPassword(!showReenterPassword);
    };
    const handleLoginRedirect = () => {
        // Redirect to the login page (adjust the path as necessary)
        window.location.href = '/login'; // Replace with your actual login route
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
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
            const response = await fetch('http://13.54.219.41/auth/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                addToken(data.token.access);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Signup successful!',
                });
                navigate('/login');
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData.email) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: errorData.email[0],
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: errorData.message || 'Signup failed',
                    });
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    
    
    

    return (
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
                        onChange={(e) => setPassword(e.target.value)}
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
                </div>

                {error && <p className='error-message'>{error}</p>}
                <button type='submit' className='reg-log-btn' disabled={loading}>
                    {loading ? 'Loading...' : 'SIGN UP'}
                </button>
            </form>
            <p className='loginbutton'>Already have an account? <button onClick={handleLoginRedirect} className='login-button'>Login</button></p>
        </div>
    );
}

export default Signup;
