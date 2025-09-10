import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('bancoVirtualToken'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateTokenAndFetchUser = async () => {
            const storedToken = localStorage.getItem('bancoVirtualToken');
            if (storedToken) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setToken(storedToken);
                    } else {
                        localStorage.removeItem('bancoVirtualToken');
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('AuthContext useEffect: Erro ao validar token:', error);
                    localStorage.removeItem('bancoVirtualToken');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        validateTokenAndFetchUser();
    }, []); // Roda apenas uma vez ao montar o AuthProvider

    const loginAction = (apiResponseData) => {
        localStorage.setItem('bancoVirtualToken', apiResponseData.token);
        setToken(apiResponseData.token);
        setUser(apiResponseData.user);
        navigate('/dashboard');
    };

    const logoutAction = () => {
        localStorage.removeItem('bancoVirtualToken');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const updateUserBalance = (newBalance) => {
        if (user) { 
            setUser(prevUser => ({
                ...prevUser,
                balance: newBalance
            }));
        }
    };
    
    const value = {
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        loginAction,
        logoutAction,
        updateUserBalance,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};