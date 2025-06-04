// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    console.log('ProtectedRoute renderizando. isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

    if (isLoading) {
        console.log('ProtectedRoute: isLoading é true, mostrando "Verificando..."');
        return <div>Verificando autenticação...</div>;
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute: !isAuthenticated é true, redirecionando para /login');
        return <Navigate to="/login" replace />;
    }

    console.log('ProtectedRoute: Autenticado! Renderizando Outlet.');
    return <Outlet />;
};

export default ProtectedRoute;