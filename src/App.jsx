// src/App.jsx
import React from 'react';
// CERTIFIQUE-SE QUE ESTA LINHA ESTÁ COMPLETA E CORRETA:
import { Routes, Route, Link } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // Usando a DashboardPage real
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

function App() {
  const { isAuthenticated, logoutAction } = useAuth();

  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#222', color: 'white' }}>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
          <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
              <li>
                <button onClick={logoutAction} style={{ background: 'none', border: 'none', color: '#30c0f0', cursor: 'pointer', padding: 0, fontSize: '1em' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
              <li><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Cadastro</Link></li>
            </>
          )}
        </ul>
      </nav>
      <hr />
      <div style={{ padding: '20px' }}>
        <Routes> {/* Esta tag precisa do import Routes */}
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} /> {/* Esta tag precisa do import Route */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <div>
              <h2>Página Inicial do Banco Virtual</h2>
              <p>Bem-vindo ao nosso sistema! Por favor, faça login ou cadastre-se.</p>
            </div>
          } />

          {/* Rotas Protegidas Aninhadas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} /> {/* Usando a DashboardPage real */}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;