import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function WithdrawPage() {
    const { token, user, updateUserBalance } = useAuth();
    const navigate = useNavigate();

    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMessage('O valor do saque deve ser um número positivo.');
            setIsSubmitting(false);
            return;
        }

        if (user && user.balance < valorNumerico) {
            setMessage('Saldo insuficiente para realizar este saque.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/transactions/withdrawal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    valor: valorNumerico, 
                    descricao 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Saque de CR$ ${valorNumerico.toFixed(2)} realizado com sucesso! Seu novo saldo é CR$ ${data.balance.toFixed(2)}.`);
            
                if (data.balance !== undefined) {
                    updateUserBalance(data.balance);
                }
                
                setValor('');
                setDescricao('');
                
            } else {
                setMessage(data.message || 'Erro ao realizar o saque.');
            }
        } catch (error) {
            setMessage('Erro de conexão ou resposta inválida do servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="withdraw-page-container" style={{maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif'}}>
            <h2 style={{textAlign: 'center', color: '#333'}}>Realizar Saque Interplanetário</h2>
            {}
            {user && <p style={{textAlign: 'center', marginBottom: '20px', fontSize: '1.1em'}}>Saldo Atual: <strong style={{color: '#007bff'}}>CR$ {user.balance?.toFixed(2)}</strong></p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="valor">Valor do Saque (CR$):</label>
                    <input
                        type="number" id="valor" value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required placeholder="0.00" step="0.01" min="0.01"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                    <label htmlFor="descricao">Descrição (Opcional):</label>
                    <textarea
                        id="descricao" value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows="3" placeholder="Ex: Retirada para manutenção da nave..."
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{width: '100%', padding: '12px', backgroundColor: isSubmitting ? '#aaa' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1em'}}>
                    {isSubmitting ? 'Processando Saque...' : 'Confirmar Saque'}
                </button>
            </form>
            {message && (
                <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.toLowerCase().includes('sucesso') ? '#d4edda' : '#f8d7da', color: message.toLowerCase().includes('sucesso') ? '#155724' : '#721c24', border: `1px solid ${message.toLowerCase().includes('sucesso') ? '#c3e6cb' : '#f5c6cb'}`, borderRadius: '4px', textAlign: 'center' }}>
                    {message}
                </p>
            )}
            <button onClick={() => navigate('/dashboard')} style={{display: 'block', width: 'fit-content', margin: '20px auto 0', padding: '10px 20px', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: 'white'}}>
                Voltar ao Dashboard
            </button>
        </div>
    );
}

export default WithdrawPage;