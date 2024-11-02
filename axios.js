// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Set your base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Set a timeout if needed
});

export default axiosInstance;
