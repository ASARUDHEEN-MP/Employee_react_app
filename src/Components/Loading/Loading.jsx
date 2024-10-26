import React from 'react';
import './Loading.css'; // Make sure this path is correct

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p> {/* Added class for styling */}
        </div>
    );
};

export default Loading;
