
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { loginAction } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false); // Adicionando estado de submissão

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true); // Ativa o estado de submissão
        // console.log('LoginPage: Tentando fazer login com:', { email, password }); // Pode manter para debug

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
                // console.log('LoginPage: Login API call bem-sucedido:', data); // Pode manter para debug
                loginAction(data); 
                // A mensagem de sucesso não é mais necessária aqui, pois haverá redirecionamento
            } else {
                // console.error('LoginPage: Erro no login da API:', data); // Pode manter para debug
                setMessage(data.message || 'Erro ao tentar fazer login.');
            }
        } catch (error) {
            // console.error('LoginPage: Erro de rede ou parse do JSON:', error); // Pode manter para debug
            setMessage('Erro de conexão ou resposta inválida do servidor.');
        } finally {
            setIsSubmitting(false); // Desativa o estado de submissão
        }
    };

    return (
    <div 
        className="login-page-container" 
        // Podemos mover estes estilos para um LoginPage.scss ou _layout.scss depois
        style={{
            maxWidth: '450px', 
            margin: '60px auto', 
            padding: '30px 40px', // Aumentei o padding lateral
            border: `1px solid ${/* Use sua variável SASS para cor de borda aqui, ex: vars.$border-color-light */ '#dee2e6'}`, 
            borderRadius: '8px', 
            boxShadow: '0 6px 20px rgba(0,0,0,0.07)', // Sombra mais suave
            backgroundColor: '#ffffff' // Fundo branco para o card de login
        }}
    >
        <h2 style={{
            textAlign: 'center', 
            color: /* vars.$primary-brand-color */ '#0052cc', // Use sua variável SASS
            marginBottom: '30px', // Mais espaço
            fontSize: '1.75rem' // Tamanho do título
        }}>
            Login - Ponte de Comando
        </h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group"> {/* Classe de _forms.scss */}
                <label htmlFor="email">Email Comlink:</label> {/* Texto do label atualizado */}
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu.identificador@estacao.com"
                />
            </div>
            <div className="form-group"> {/* Classe de _forms.scss */}
                <label htmlFor="password">Senha de Acesso:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Sua chave secreta"
                />
            </div>
            <button 
                type="submit" 
                className="form-button" // Classe de _forms.scss
                disabled={isSubmitting}
                // Estilos inline para o botão podem ser removidos se .form-button for suficiente
            >
                {isSubmitting ? 'Conectando...' : 'Conectar'}
            </button>
        </form>
        {message && (
            // Usando as classes SASS para feedback
            <p className={`form-feedback-message ${message.toLowerCase().includes('sucesso') ? 'success' : 'error'}`}>
                {message}
            </p>
        )}
        <p style={{textAlign: 'center', marginTop: '25px', fontSize: '0.95em'}}>
            Ainda não é um piloto registrado? <Link to="/register" style={{color: /* vars.$primary-brand-color */ '#0052cc', fontWeight: 'bold'}}>Aliste-se aqui!</Link>
        </p>
    </div>
);
}

export default LoginPage;