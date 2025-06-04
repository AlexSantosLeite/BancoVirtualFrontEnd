// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { loginAction } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        console.log('LoginPage: Tentando fazer login com:', { email, password });

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('LoginPage: Login API call bem-sucedido:', data);
                loginAction(data); 
            } else {
                console.error('LoginPage: Erro no login da API:', data);
                setMessage(data.message || 'Erro ao tentar fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('LoginPage: Erro de rede ou parse do JSON:', error);
            setMessage('Erro de conexão ou resposta inválida do servidor.');
        }
    };

    return (
        <div className="login-page-container" style={{maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h2>Login - Ponte de Comando</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="email" style={{display: 'block', marginBottom: '5px'}}>Frequência de Rádio (Email):</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seuemail@exemplo.com"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div className="form-group" style={{marginBottom: '15px'}}>
                    <label htmlFor="password" style={{display: 'block', marginBottom: '5px'}}>Senha de Acesso:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Sua senha"
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <button type="submit" className="btn-login" style={{width: '100%', padding: '10px', backgroundColor: '#30c0f0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Conectar</button>
            </form>
            {message && <p className="login-message" style={{marginTop: '15px', color: message.startsWith('Login bem-sucedido') ? 'green' : 'red'}}>{message}</p>}
        </div>
    );
}

export default LoginPage;