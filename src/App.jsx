import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import TransferPage from './pages/TransferPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, logoutAction } = useAuth();

  return (
    <div className="bg-slate-100 text-gray-800 min-h-screen">
      <nav className="main-nav">
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={logoutAction} className="nav-button">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Cadastro</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="container mx-auto p-5">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Ninho de Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
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