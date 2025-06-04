
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import './RegisterPage.css'; // Descomente se criar um CSS dedicado

function RegisterPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        if (!nome || !email || !senha || !confirmarSenha) {
            setMessage('Todos os campos são obrigatórios.');
            setIsSubmitting(false);
            return;
        }
        if (senha !== confirmarSenha) {
            setMessage('As senhas não coincidem.');
            setIsSubmitting(false);
            return;
        }

        console.log('RegisterPage: Tentando registrar com:', { nome, email, senha: '***' }); // Não logar senha em produção

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (response.status === 201) { // Backend retorna 201 para sucesso no registro
                console.log('RegisterPage: Cadastro bem-sucedido:', data);
                setMessage(data.message || 'Cadastro realizado com sucesso! Você será redirecionado para o login em instantes.');
                
                setNome('');
                setEmail('');
                setSenha('');
                setConfirmarSenha('');

                setTimeout(() => {
                    navigate('/login');
                }, 2500); // Redireciona após 2.5 segundos

            } else {
                console.error('RegisterPage: Erro no cadastro (API):', data);
                setMessage(data.message || 'Erro ao tentar realizar o cadastro. Verifique os dados ou tente um email diferente.');
            }
        } catch (error) {
            console.error('RegisterPage: Erro de rede ou parse do JSON:', error);
            setMessage('Erro de conexão ou resposta inválida do servidor ao tentar cadastrar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page-container" style={{maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif'}}>
            <h2 style={{textAlign: 'center', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Registro de Novo Piloto</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="nome" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Nome de Piloto (Completo):</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        placeholder="Seu nome completo"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="email" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Frequência de Rádio (Email):</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu.email@estacaoespacial.com"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="senha" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Senha de Acesso (min. 6 caracteres):</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength="6"
                        placeholder="Crie uma senha segura"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                    <label htmlFor="confirmarSenha" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Confirme sua Senha de Acesso:</label>
                    <input
                        type="password"
                        id="confirmarSenha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                        minLength="6"
                        placeholder="Repita a senha"
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn-register" 
                    disabled={isSubmitting}
                    style={{width: '100%', padding: '12px', backgroundColor: isSubmitting ? '#aaa' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1em', fontWeight: 'bold'}}
                >
                    {isSubmitting ? 'Registrando Novo Piloto...' : 'Confirmar Registro'}
                </button>
            </form>
            {message && (
                <p className="register-message" style={{
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
            <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9em'}}>
                Já possui uma credencial de piloto? <Link to="/login" style={{color: '#007bff', textDecoration: 'none'}}>Acessar Ponte de Comando (Login)</Link>.
            </p>
        </div>
    );
}

export default RegisterPage;