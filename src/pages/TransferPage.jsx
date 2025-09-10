import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function TransferPage() {
    const { token, updateUserBalance } = useAuth(); // token e a função de atualizar saldo
    const navigate = useNavigate();

    // Estados para os campos do formulário de transferência
    const [destinatarioEmail, setDestinatarioEmail] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    
    // Estados para feedback e controle do formulário
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        const valorNumerico = parseFloat(valor);
        if (!destinatarioEmail || isNaN(valorNumerico) || valorNumerico <= 0) {
            setMessage('Email do destinatário e um valor positivo são obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Chamada para o endpoint de transferência no backend
            const response = await fetch('http://localhost:5000/api/transactions/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    destinatarioEmail,
                    valor: valorNumerico, 
                    descricao 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Transferência de CR$ ${valorNumerico.toFixed(2)} para ${destinatarioEmail} realizada com sucesso!`);
                
                // Atualiza o saldo no AuthContext com o novo saldo retornado pelo backend
                if (data.balance !== undefined) {
                    updateUserBalance(data.balance);
                }
                
                // Limpar formulário
                setDestinatarioEmail('');
                setValor('');
                setDescricao('');
                
                // Opcional: Redirecionar para o dashboard após um tempo
                setTimeout(() => navigate('/dashboard'), 3000); 
            } else {
                setMessage(data.message || 'Erro ao realizar a transferência.');
            }
        } catch (error) {
            setMessage('Erro de conexão ou resposta inválida do servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="transfer-page-container" style={{maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif'}}>
            <h2 style={{textAlign: 'center', color: '#333'}}>Realizar Transferência</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="destinatarioEmail">Email do Destinatário:</label>
                    <input
                        type="email"
                        id="destinatarioEmail"
                        value={destinatarioEmail}
                        onChange={(e) => setDestinatarioEmail(e.target.value)}
                        required
                        placeholder="email.do.destinatario@exemplo.com"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="valor">Valor da Transferência (CR$):</label>
                    <input
                        type="number"
                        id="valor"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                    <label htmlFor="descricao">Descrição (Opcional):</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows="3"
                        placeholder="Ex: Pagamento de serviços"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', resize: 'vertical'}}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{width: '100%', padding: '12px', backgroundColor: isSubmitting ? '#aaa' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1em'}}>
                    {isSubmitting ? 'Enviando...' : 'Confirmar Transferência'}
                </button>
            </form>
            {message && (
                <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.toLowerCase().includes('sucesso') ? '#d4edda' : '#f8d7da', color: message.toLowerCase().includes('sucesso') ? '#155724' : '#721c24', border: `1px solid ${message.toLowerCase().includes('sucesso') ? '#c3e6cb' : '#f5c6cb'}`, borderRadius: '4px', textAlign: 'center' }}>
                    {message}
                </p>
            )}
            <button onClick={() => navigate('/dashboard')} style={{display: 'block', width: 'fit-content', margin: '20px auto 0', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>
                Voltar ao Dashboard
            </button>
        </div>
    );
}

export default TransferPage;