// src/pages/TestDashboardPage.jsx
import React from 'react';

function TestDashboardPage() {
  console.log('TestDashboardPage está RENDERIZANDO!');
  return (
    <div style={{ border: '5px solid green', padding: '20px', backgroundColor: 'lightgreen' }}>
      <h1>PÁGINA DE TESTE DO DASHBOARD FUNCIONA!</h1>
      <p>Se você vê isso, o login, AuthContext, ProtectedRoute e o roteamento básico estão funcionando!</p>
    </div>
  );
}

export default TestDashboardPage;