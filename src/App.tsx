import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Editais } from './pages/Editais';
import { Favoritos } from './pages/Favoritos';
import Profile from './pages/Profile';
import PublishEdital from './pages/PublishEdital';
import MeusEditais from './pages/MeusEditais';
import './styles/global.css';

// Componente interno para aguardar a inicialização da autenticação
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/editais" element={<Editais />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/meus-editais" element={<MeusEditais />} />
        <Route path="/publicar" element={<PublishEdital />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Páginas com funcionalidades futuras


function Configuracoes() {
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div className="coming-soon">
        ⚙️
        <h2>Configurações</h2>
        <p>Funcionalidade disponível em breve!</p>
        <p>Personalize notificações, preferências e configurações da conta.</p>
      </div>
    </div>
  );
}

export default App;
