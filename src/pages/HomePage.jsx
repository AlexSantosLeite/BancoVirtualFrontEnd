import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-sky-600 mb-6">
        Bem-vindo ao NexusBank! 🚀
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
        Sua plataforma confiável para gerenciar seus Créditos Estelares com segurança e eficiência através da galáxia.
      </p>
      
      {!isAuthenticated ? (
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
      ) : (
          <div className="mt-12">
              <p className="text-xl text-gray-700 mb-6">Sua sessão está ativa, Comandante.</p>
              <Link 
                  to="/dashboard" 
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                  Ir para o Dashboard
              </Link>
          </div>
      )}
    </div>
  );
}

export default HomePage;