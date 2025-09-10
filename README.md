# Banco Virtual (Frontend)

Esta é a interface de usuário (UI) para o projeto Banco Virtual, construída com React. Ela consome a API do backend para fornecer uma experiência de internet banking completa e reativa.

---

## ✨ Funcionalidades Principais

-   **Fluxo de Autenticação:** Páginas de Registro e Login com feedback em tempo real.
-   **Login Automático:** Usuários são logados automaticamente após o registro.
-   **Dashboard do Usuário:** Visualização do saldo atual e acesso rápido às operações.
-   **Operações em Tempo Real:** Páginas de Depósito, Saque e Transferência que atualizam o saldo do usuário instantaneamente, sem precisar recarregar a página.
-   **Histórico de Transações:** Exibição do histórico de transações do usuário logado.
-   **Gerenciamento de Estado Global:** `AuthContext` gerencia o estado do usuário em toda a aplicação.
-   **Rotas Protegidas:** Acesso às páginas internas (dashboard, transações) somente para usuários autenticados.

---

## 🛠️ Tecnologias Utilizadas

-   **React.js:** Biblioteca para construção da interface de usuário.
-   **Vite:** Ferramenta de build para desenvolvimento frontend moderno e rápido.
-   **React Router:** Para gerenciamento de rotas na aplicação.
-   **SASS:** Pré-processador CSS para estilização avançada e organizada.
-   **Tailwind CSS:** Framework CSS para estilização utilitária.
-   **Context API:** Para gerenciamento de estado global (autenticação).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   O **servidor do Backend precisa estar rodando** para que a aplicação funcione.

### Passos para Instalação

1.  **Clone este repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_FRONTEND]
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd BancoVirtualFrontEnd
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou a porta indicada no seu terminal).