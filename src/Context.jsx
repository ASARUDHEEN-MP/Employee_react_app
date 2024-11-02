import React, { createContext, useState, useEffect } from 'react';

const MyContext = createContext();

export const Context = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null); // Add userId state

    useEffect(() => {
        
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("Role");
        const storedUsername = localStorage.getItem("username");
        const storedUserId = localStorage.getItem("userId"); // Get userId from localStorage
       
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRole) {
            setRole(storedRole);
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedUserId) {
            setUserId(storedUserId); // Set userId if exists
        }
    }, []);

    const addToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const addRole = (newRole) => {
        localStorage.setItem("Role", newRole);
        setRole(newRole);
    };

    const addUsername = (newUsername) => {
        localStorage.setItem("username", newUsername);
        setUsername(newUsername);
    };

    const addUserId = (newUserId) => { // Add a method to set userId
        console.log(newUserId,"from context")
        localStorage.setItem("userId", newUserId);
        setUserId(newUserId);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        localStorage.removeItem("username");
        localStorage.removeItem("userId"); // Clear userId on logout
        setToken(null);
        setRole(null);
        setUsername(null);
        setUserId(null); // Reset userId state
    };

    return (
        <MyContext.Provider value={{ token, addToken, addRole, addUsername, addUserId, username, role, userId, logout }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = () => React.useContext(MyContext);
