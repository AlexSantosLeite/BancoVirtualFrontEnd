// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// import './DashboardPage.css'; // Descomente se você criar um arquivo CSS para esta página

function DashboardPage() {
    const { user, token, isLoading, logoutAction } = useAuth();
    
    // Estados para transações
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState('');

    console.log('DashboardPage (REAL) renderizando. isLoading (auth):', isLoading, 'user:', user ? user.email : 'null');

    // useEffect para buscar o histórico de transações quando o token estiver disponível
    useEffect(() => {
        const fetchTransactions = async () => {
            // Só busca se tivermos um token e o carregamento inicial do usuário/auth já tiver terminado
            if (token && !isLoading) { 
                console.log('DashboardPage: Buscando histórico de transações com token:', token.substring(0,20) + '...');
                setTransactionsLoading(true);
                setTransactionsError('');
                try {
                    const response = await fetch('http://localhost:5000/api/transactions/my-history', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Envia o token para a rota protegida
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setTransactions(data);
                        console.log('DashboardPage: Histórico de transações recebido:', data);
                    } else {
                        const errorData = await response.json();
                        console.error('DashboardPage: Erro ao buscar transações - Resposta não OK:', errorData);
                        setTransactionsError(errorData.message || 'Falha ao buscar histórico de transações.');
                    }
                } catch (error) {
                    console.error('DashboardPage: Erro de rede ao buscar transações:', error);
                    setTransactionsError('Erro de conexão ao buscar histórico.');
                } finally {
                    setTransactionsLoading(false);
                }
            } else if (!isLoading) { 
                // Se não houver token (e o auth não estiver carregando), não há transações para buscar
                setTransactionsLoading(false);
                console.log('DashboardPage: Sem token ou auth ainda carregando, não buscando transações.');
            }
        };

        fetchTransactions();
    }, [token, isLoading]); // Dependências: refaz a busca se o token mudar ou o isLoading do AuthContext mudar

    // Lógica de renderização principal (com os 'if's anteriores)
    if (isLoading) { // isLoading do AuthContext (para dados do usuário)
        console.log('DashboardPage (REAL): isLoading (auth) é true, mostrando "Carregando Usuário..."');
        return ( 
            <div> 
                <h2>Painel de Controle</h2> 
                <p>Carregando informações do usuário...</p> 
            </div> 
        );
    }

    if (!user) {
        console.log('DashboardPage (REAL): !user é true (e não está loading de auth), mostrando "Você não está logado..."');
        return ( 
            <div> 
                <h2>Painel de Controle</h2> 
                <p>Você não está logado. Por favor, <a href="/login">faça login</a>.</p> 
            </div> 
        );
    }

    console.log('DashboardPage (REAL): Usuário existe. Renderizando conteúdo do dashboard.');
    return (
        <div className="dashboard-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #30c0f0', paddingBottom: '10px' }}>
                Painel de Controle <span className="ship-name" style={{ fontSize: '0.8em', color: '#777' }}>(Nave: {user.nome || 'Piloto'})</span>
            </h2>
            
            <div className="welcome-message" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <h3>Bem-vindo(a) de volta, Comandante {user.nome}!</h3>
                <p>Email de comunicação: {user.email}</p>
            </div>

            <div className="account-balance" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#e6f7ff', borderRadius: '5px' }}>
                <h4>Saldo da Conta Estelar:</h4>
                <p className="balance-amount" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#007bff' }}>
                    CR$ {user.saldoConta?.toFixed(2) || '0.00'}
                </p> 
            </div>

            <div className="transaction-history" style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <h4>Histórico de Transações Recentes</h4>
                {transactionsLoading && <p>Carregando histórico de transações...</p>}
                {transactionsError && <p style={{ color: 'red' }}>{transactionsError}</p>}
                {!transactionsLoading && !transactionsError && transactions.length === 0 && (
                    <p>Nenhuma transação encontrada no seu histórico.</p>
                )}
                {!transactionsLoading && !transactionsError && transactions.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {transactions.map((tx) => (
                            <li key={tx._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                                <p><strong>Data:</strong> {new Date(tx.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Tipo:</strong> <span style={{ fontWeight: 'bold' }}>{tx.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
                                <p><strong>Valor:</strong> <span style={{ fontWeight: 'bold', color: tx.tipo.includes('enviada') || tx.tipo.includes('saque') ? '#dc3545' : '#28a745' }}>
                                    CR$ {tx.valor.toFixed(2)}
                                </span></p>
                                {tx.parteContraria && tx.parteContraria.email && (
                                    <p><strong>Para/De:</strong> {tx.parteContraria.nome || tx.parteContraria.email}</p>
                                )}
                                {tx.descricao && <p><strong>Descrição:</strong> {tx.descricao}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="dashboard-actions" style={{ marginTop: '20px' }}>
                {/* Futuramente, botões para "Nova Transferência", "Depósito", "Saque" */}
                <p>Próximas ações disponíveis em breve...</p>
            </div>

            <button 
                onClick={logoutAction} 
                className="btn-logout" 
                style={{padding: '10px 20px', backgroundColor: '#c03030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', fontSize: '1em'}}
            >
                Desconectar (Logout)
            </button>

            {/* Informações de Debug */}
            <div style={{ marginTop: '30px', fontSize: '0.8em', wordBreak: 'break-all', border: '1px dashed #ccc', padding: '10px', backgroundColor: '#efefef' }}>
                <p><strong>Debug Info (DashboardPage):</strong></p>
                <p>Is Loading (AuthContext): {isLoading ? 'Sim' : 'Não'}</p>
                <p>Token: {token ? token.substring(0, 50) + '...' : 'Nenhum token'}</p>
                <p>User Object: {user ? JSON.stringify(user) : 'Nenhum usuário'}</p>
                <p>Transactions Loading: {transactionsLoading ? 'Sim' : 'Não'}</p>
                <p>Transactions Error: {transactionsError || 'Nenhum erro'}</p>
                <p>Transactions Count: {transactions.length}</p>
            </div>
        </div>
    );
}

export default DashboardPage;