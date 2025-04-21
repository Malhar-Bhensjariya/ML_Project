import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Fix here!

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const NODE_API = import.meta.env.VITE_NODE_API;

    const fetchUser = async (userId) => {
        try {
            const response = await axios.get(`${NODE_API}/auth/profile/${userId}`);
            const userData = response.data;
            const token = localStorage.getItem('token');
            setUser({ ...userData, token }); // Assuming response.data is the user object
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);  // Use correctly named import
                const userId = decoded.id; // Extract userId from token

                fetchUser(userId);
            } catch (error) {
                console.error('Invalid token', error);
                setUser(null);
                localStorage.removeItem('token');
                setLoading(false);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;