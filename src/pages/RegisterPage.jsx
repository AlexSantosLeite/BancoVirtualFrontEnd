import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importar o useAuth

function RegisterPage() {
    // 2. Nomes dos estados padronizados para inglês para consistência
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { loginAction } = useAuth(); // Pegar a loginAction do contexto

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 3. Corpo da requisição (body) corrigido para usar name e password
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 4. Lógica de sucesso agora chama loginAction para auto-login!
                // O backend já retorna o token e o usuário no registro.
                console.log('RegisterPage: Cadastro bem-sucedido, fazendo login automático:', data);
                loginAction(data); // O AuthContext cuida de tudo: salvar token, estado e redirecionar.
            } else {
                // Se houver erros de validação do backend (ex: email já existe)
                // O 'data.errors' vem do express-validator
                const errorMessage = data.errors ? data.errors[0].msg : data.message;
                setMessage(errorMessage || 'Erro ao tentar realizar o cadastro.');
            }
        } catch (error) {
            setMessage('Erro de conexão ou resposta inválida do servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page-container" style={{maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h2>Registro de Novo Piloto</h2>
            <form onSubmit={handleSubmit}>
                {}
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="name">Nome de Piloto (Completo):</label>
                    <input
                        type="text" id="name" value={name}
                        onChange={(e) => setName(e.target.value)}
                        required placeholder="Seu nome completo"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="email">Frequência de Rádio (Email):</label>
                    <input
                        type="email" id="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required placeholder="seuemail@exemplo.com"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="password">Senha de Acesso (min. 6 caracteres):</label>
                    <input
                        type="password" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required minLength="6" placeholder="Crie uma senha segura"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                    <label htmlFor="confirmPassword">Confirme sua Senha de Acesso:</label>
                    <input
                        type="password" id="confirmPassword" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required minLength="6" placeholder="Repita a senha"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{width: '100%', padding: '10px', backgroundColor: isSubmitting ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1em'}}>
                    {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
                </button>
            </form>
            {message && (
                <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: `1px solid #f5c6cb`, borderRadius: '4px' }}>
                    {message}
                </p>
            )}
            <p style={{textAlign: 'center', marginTop: '20px'}}>
                Já possui uma conta? <Link to="/login">Faça Login aqui</Link>.
            </p>
        </div>
    );
}

export default RegisterPage;