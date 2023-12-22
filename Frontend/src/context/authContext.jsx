import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getStoredToken, removeToken, setToken } from '../security/authService';

// Contexto para manejar la autenticación de los usuarios. 
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = async (username, password) => {
        try {
            const token = await getToken(username, password);
            setToken(token);
    
            const userInfo = await getUserInfo(token);
            console.log("User info:", userInfo); // Para depuración
            setCurrentUser({
                username: userInfo.username,
                es_administrador: userInfo.es_administrador
            });
            console.log("Usuario actual después del inicio de sesión:", currentUser);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    };
    
    useEffect(() => {
        const token = getStoredToken();
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded token:", decodedToken); // Para depuración
            setCurrentUser({
                username: decodedToken.username,
                es_administrador: decodedToken.es_administrador
            });
        }
    }, []);
    
    
    
    

    // Función para obtener información adicional del usuario.
    const value = {
        currentUser,
        setCurrentUser,
        login: async (username, password) => {
            try {
                const token = await getToken(username, password);
                setToken(token);
                setCurrentUser(username);
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                throw error;
            }
        },        
        logout: () => {
            removeToken();
            setCurrentUser(null);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
