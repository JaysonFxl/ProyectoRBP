import React, { createContext, useContext, useState } from 'react';
import { getUserInfo, setToken, removeToken } from './authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = async (username, password) => {
        try {
            const token = await getToken(username, password);
            setToken(token);
            const userInfo = await getUserInfo(token);
            setCurrentUser(userInfo);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    };

    const logout = () => {
        removeToken();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
