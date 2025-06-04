
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Importar Link para navegação

// import './DashboardPage.css'; // Descomente se você criar um arquivo CSS para esta página

function DashboardPage() {
    const { user, token, isLoading: authIsLoading, logoutAction } = useAuth(); // Renomeado isLoading para authIsLoading para clareza
    
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState('');

    console.log('DashboardPage renderizando. authIsLoading:', authIsLoading, 'user:', user ? user.email : 'null');

    useEffect(() => {
        const fetchTransactions = async () => {
            // Só busca se tivermos um token e o carregamento inicial do usuário/auth já tiver terminado
            if (token && !authIsLoading) { 
                console.log('DashboardPage: Buscando histórico de transações com token...');
                setTransactionsLoading(true);
                setTransactionsError('');
                try {
                    const response = await fetch('http://localhost:5000/api/transactions/my-history', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
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
            } else if (!authIsLoading) { 
                setTransactionsLoading(false);
                console.log('DashboardPage: Sem token ou auth ainda carregando, não buscando transações.');
            }
        };

        fetchTransactions();
    }, [token, authIsLoading]); // Dependências atualizadas

    if (authIsLoading) {
        console.log('DashboardPage: authIsLoading é true, mostrando "Carregando Usuário..."');
        return ( 
            <div> 
                <h2>Painel de Controle</h2> 
                <p>Carregando informações do usuário...</p> 
            </div> 
        );
    }

    if (!user) {
        console.log('DashboardPage: !user é true (e não está authIsLoading), mostrando "Você não está logado..."');
        return ( 
            <div> 
                <h2>Painel de Controle</h2> 
                <p>Você não está logado. Por favor, <Link to="/login">faça login</Link>.</p>
            </div> 
        );
    }

    console.log('DashboardPage: Usuário existe. Renderizando conteúdo do dashboard.');
    return (
        <div className="dashboard-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #30c0f0', paddingBottom: '10px' }}>
                <h2>Painel de Controle <span style={{ fontSize: '0.8em', color: '#777' }}>(Nave: {user.nome || 'Piloto'})</span></h2>
                <button 
                    onClick={logoutAction} 
                    className="btn-logout" 
                    style={{padding: '8px 15px', backgroundColor: '#c03030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em'}}
                >
                    Desconectar (Logout)
                </button>
            </div>
            
            <div className="welcome-message" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px', borderLeft: '5px solid #007bff' }}>
                <h3>Bem-vindo(a) de volta, Comandante {user.nome}!</h3>
                <p>Email de comunicação: {user.email}</p>
            </div>

            <div className="account-summary" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div className="account-balance" style={{ flex: 1, padding: '15px', backgroundColor: '#e6f7ff', borderRadius: '5px', textAlign: 'center' }}>
                    <h4>Saldo da Conta Estelar:</h4>
                    <p className="balance-amount" style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff', margin: '10px 0' }}>
                        CR$ {user.saldoConta?.toFixed(2) || '0.00'}
                    </p> 
                </div>
                <div className="dashboard-actions" style={{ flex: 1, padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <h4>Ações Rápidas:</h4>
                    <Link to="/transferencia" style={{ 
                        display: 'block', 
                        width: '80%',
                        textAlign: 'center',
                        padding: '10px 15px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '5px'
                    }}>
                        Nova Transferência
                    </Link>
                    <Link to="/deposito" style={{ 
                        display: 'block', 
                        width: '80%',
                        textAlign: 'center',
                        padding: '10px 15px', 
                        backgroundColor: '#28a745', // Cor diferente para depósito
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '5px',
                        marginBottom: '10px' 
                    }}>
                        Realizar Depósito
                    </Link>
                    <Link to="/saque" style={{ 
                        display: 'block', 
                        width: '80%',
                        textAlign: 'center',
                        padding: '10px 15px', 
                        backgroundColor: '#dc3545', // Cor diferente para saque (vermelho)
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '5px' 
                    }}>
                        Realizar Saque
                    </Link>
                    <p style={{fontSize: '0.9em', color: '#6c757d'}}>Depósito / Saque (em breve)</p>
                </div>
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
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                    <span style={{fontSize: '0.9em', color: '#6c757d'}}>
                                        {new Date(tx.data).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85em', color: 'white', backgroundColor: tx.tipo.includes('enviada') || tx.tipo.includes('saque') ? '#dc3545' : '#28a745' }}>
                                        {tx.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                                <p style={{margin: '5px 0', fontSize: '1.2em', fontWeight: 'bold', color: tx.tipo.includes('enviada') || tx.tipo.includes('saque') ? '#dc3545' : '#28a745' }}>
                                    CR$ {tx.valor.toFixed(2)}
                                </p>
                                {tx.parteContraria && tx.parteContraria.email && (
                                    <p style={{margin: '5px 0', fontSize: '0.9em'}}>
                                        <strong>{tx.tipo.includes('enviada') ? 'Para:' : 'De:'}</strong> {tx.parteContraria.nome || tx.parteContraria.email}
                                    </p>
                                )}
                                {tx.descricao && <p style={{margin: '5px 0', fontSize: '0.9em', color: '#6c757d'}}><em>Descrição: {tx.descricao}</em></p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Informações de Debug - Remova ou comente em produção */}
            <div style={{ marginTop: '30px', fontSize: '0.8em', wordBreak: 'break-all', border: '1px dashed #ccc', padding: '10px', backgroundColor: '#efefef' }}>
                <p><strong>Debug Info (DashboardPage):</strong></p>
                <p>Is Loading (AuthContext): {authIsLoading ? 'Sim' : 'Não'}</p>
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