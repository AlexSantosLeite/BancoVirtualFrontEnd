
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
            console.log('AuthContext useEffect: Iniciando validação de token...');
            const storedToken = localStorage.getItem('bancoVirtualToken');
            if (storedToken) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/me', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setToken(storedToken); // Garante que o token no estado é o do localStorage
                        console.log('AuthContext useEffect: Usuário validado e carregado:', userData);
                    } else {
                        console.log('AuthContext useEffect: Token do localStorage inválido, removendo.');
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
            console.log('AuthContext useEffect: Chamando setIsLoading(false). Estado anterior de isLoading:', isLoading);
            setIsLoading(false);
        };

        validateTokenAndFetchUser();
    }, []); // Roda apenas uma vez ao montar o AuthProvider

    const loginAction = (apiResponseData) => {
        localStorage.setItem('bancoVirtualToken', apiResponseData.token);
        setToken(apiResponseData.token);
        setUser(apiResponseData.user);
        console.log('AuthContext loginAction: Token e usuário salvos. Navegando para dashboard.');
        navigate('/dashboard');
    };

    const logoutAction = () => {
        localStorage.removeItem('bancoVirtualToken');
        setToken(null);
        setUser(null);
        console.log('AuthContext logoutAction: Token e usuário removidos. Navegando para login.');
        navigate('/login');
    };

    const updateUserBalance = (newBalance) => {
        if (user) { 
            setUser(prevUser => ({
                ...prevUser,
                saldoConta: newBalance
            }));
            console.log('AuthContext updateUserBalance: Saldo do usuário atualizado no contexto para:', newBalance);
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