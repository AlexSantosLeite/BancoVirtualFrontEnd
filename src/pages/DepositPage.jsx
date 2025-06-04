
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import './DepositPage.css'; // Descomente se criar um CSS dedicado

function DepositPage() {
    const { token, updateUserBalance } = useAuth(); // Pegamos o token e a função de atualizar saldo
    const navigate = useNavigate();

    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        // Validação básica do frontend
        if (!valor) {
            setMessage('O valor do depósito é obrigatório.');
            setIsSubmitting(false);
            return;
        }
        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMessage('O valor do depósito deve ser um número positivo.');
            setIsSubmitting(false);
            return;
        }

        console.log('DepositPage: Enviando depósito:', { valor: valorNumerico, descricao });

        try {
            const response = await fetch('http://localhost:5000/api/transactions/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Token de autenticação
                },
                body: JSON.stringify({ 
                    valor: valorNumerico, 
                    descricao 
                }),
            });

            const data = await response.json();

            if (response.ok) { // Geralmente status 200 OK para depósito
                console.log('DepositPage: Depósito bem-sucedido:', data);
                setMessage(`Depósito de CR$ ${valorNumerico.toFixed(2)} realizado com sucesso! Seu novo saldo é CR$ ${data.saldoAtual.toFixed(2)}.`);
                
                // Atualiza o saldo no AuthContext
                if (data.saldoAtual !== undefined) {
                    updateUserBalance(data.saldoAtual);
                }
                
                // Limpar formulário
                setValor('');
                setDescricao('');
                
                // Opcional: Redirecionar para o dashboard após um tempo
                // setTimeout(() => navigate('/dashboard'), 3000); 
            } else {
                console.error('DepositPage: Erro no depósito (API):', data);
                setMessage(data.message || 'Erro ao realizar o depósito.');
            }
        } catch (error) {
            console.error('DepositPage: Erro de rede ou parse do JSON:', error);
            setMessage('Erro de conexão ou resposta inválida do servidor ao tentar depositar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="deposit-page-container" style={{maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif'}}>
            <h2 style={{textAlign: 'center', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Realizar Depósito Estelar</h2>
            <form onSubmit={handleSubmit} className="deposit-form">
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="valor" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Valor do Depósito (CR$):</label>
                    <input
                        type="number"
                        id="valor"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        placeholder="0.00"
                        step="0.01" // Para aceitar centavos
                        min="0.01"  // Mínimo valor
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                    <label htmlFor="descricao" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Descrição (Opcional):</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows="3"
                        placeholder="Ex: Créditos de recarga..."
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical'}}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn-deposit" 
                    disabled={isSubmitting}
                    style={{width: '100%', padding: '12px', backgroundColor: isSubmitting ? '#aaa' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1em', fontWeight: 'bold'}}
                >
                    {isSubmitting ? 'Processando Depósito...' : 'Confirmar Depósito'}
                </button>
            </form>
            {message && (
                <p className="deposit-message" style={{
                    marginTop: '20px', 
                    padding: '10px', 
                    backgroundColor: message.toLowerCase().includes('sucesso') ? '#d4edda' : '#f8d7da', 
                    color: message.toLowerCase().includes('sucesso') ? '#155724' : '#721c24',
                    border: `1px solid ${message.toLowerCase().includes('sucesso') ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    textAlign: 'center'
                }}>
                    {message}
                </p>
            )}
            <button 
                onClick={() => navigate('/dashboard')} 
                style={{display: 'block', width: 'fit-content', margin: '20px auto 0', padding: '10px 20px', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: 'white'}}
            >
                Voltar ao Dashboard
            </button>
        </div>
    );
}

export default DepositPage;