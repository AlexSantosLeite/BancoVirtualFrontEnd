
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // Usando a DashboardPage real
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';
import TransferPage from './pages/TransferPage.jsx';
import DepositPage from './pages/DepositPage.jsx';
import WithdrawPage from './pages/WithdrawPage.jsx'

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
        <Routes>
          <Route path="/login" element={<LoginPage />} /> 
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
            <Route path="/transferencia" element={<TransferPage />} />
            <Route path="/deposito" element={<DepositPage />} />
            <Route path="/saque" element={<WithdrawPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;