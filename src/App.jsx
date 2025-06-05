// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css'; // Seu CSS para App pode complementar os estilos SASS/Tailwind
import TransferPage from './pages/TransferPage.jsx';
import DepositPage from './pages/DepositPage.jsx';
import WithdrawPage from './pages/WithdrawPage.jsx';

function App() {
  const { isAuthenticated, logoutAction } = useAuth();

  return (
    // A div principal ainda pode ter classes Tailwind se você quiser um fundo geral diferente do SASS body
    <div className="bg-slate-100 text-gray-800 min-h-screen"> {/* Mantendo suas classes Tailwind aqui por enquanto */}
      <nav className="main-nav"> {/* Aplicando a classe SASS */}
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: 0, padding: 0 }}> {/* Mantive estilos inline para layout flex da ul, pode mover para SASS depois */}
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <button
                  onClick={logoutAction}
                  className="nav-button" // Classe SASS para o botão
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Cadastro</Link></li>
            </>
          )}
        </ul>
      </nav>
      {/* <hr />  // Removido, a nav deve ter sua própria definição visual */}
      
      <div className="container mx-auto p-5"> {/* Classes Tailwind para o container principal */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <div className="text-center py-10 px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-sky-600 mb-6">
                Bem-vindo ao Banco Virtual Estelar! 🚀
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                Sua plataforma confiável para gerenciar seus Créditos Estelares com segurança e eficiência através da galáxia. Realize transferências, controle seus gastos e planeje suas próximas missões financeiras.
              </p>
              
              <div className="my-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recursos Principais da Sua Estação Financeira:</h3>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-xl font-semibold text-sky-700 mb-2">🪐 Transferências Seguras</h4>
                    <p className="text-gray-600">Envie e receba créditos entre Comandantes com agilidade e protocolos de segurança avançados.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-xl font-semibold text-sky-700 mb-2">🛰️ Histórico Detalhado</h4>
                    <p className="text-gray-600">Acompanhe todas as suas missões financeiras com um registro completo de transações.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-xl font-semibold text-sky-700 mb-2"> stazione Depósitos e Saques</h4>
                    <p className="text-gray-600">Gerencie seus fundos com operações de depósito e saque (simuladas) de forma rápida.</p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mt-12">
                  <p className="text-xl text-gray-700 mb-6">Pronto para decolar em suas finanças?</p>
                  <Link 
                    to="/register" 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg mr-4 transition-colors"
                  >
                    Criar Conta
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    Acessar Painel (Login)
                  </Link>
                </div>
              )}
            </div>
          } />

          {/* Rotas Protegidas Aninhadas */}
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