import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User, Star, FileText, LogOut, Settings, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import './Header.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="logo">
            <FileText size={32} className="logo-icon" />
            <div className="logo-text">
              <span className="logo-main">EDITAIS</span>
              <span className="logo-sub">BR</span>
            </div>
          </Link>

          <nav className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              <Home size={18} />
              Início
            </Link>
            <Link to="/editais" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              <FileText size={18} />
              Consultar Editais
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/meus-editais" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FileText size={18} />
                  Meus Editais
                </Link>
                <Link to="/favoritos" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <Star size={18} />
                  Favoritos
                </Link>
                <Link to="/publicar" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FileText size={18} />
                  Publicar Edital
                </Link>
              </>
            )}
            
            {/* Mobile only auth buttons */}
            {!isAuthenticated && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="nav-link mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} />
                  Entrar
                </Link>
                <Link to="/cadastro" className="nav-link mobile-auth-link primary" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} />
                  Cadastrar
                </Link>
              </div>
            )}
            
            {/* Mobile only user actions */}
            {isAuthenticated && (
              <div className="mobile-user-actions">
                <Link to="/perfil" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} />
                  Meu Perfil
                </Link>
                <Link to="/configuracoes" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <Settings size={18} />
                  Configurações
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="nav-link logout-btn">
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            )}
          </nav>

          <div className="header-actions">
            <button className="icon-btn search-btn" aria-label="Buscar">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <button className="icon-btn notification-btn" aria-label="Notificações">
                  <Bell size={20} />
                  <span className="notification-dot"></span>
                </button>

                <div className="user-menu" ref={userMenuRef}>
                  <button
                    className="user-menu-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User size={20} />
                    <span className="user-name">
                      {profile?.name || 'Usuário'}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <Link to="/perfil" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <User size={16} />
                        Meu Perfil
                      </Link>
                      <Link to="/configuracoes" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <Settings size={16} />
                        Configurações
                      </Link>
                      <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="dropdown-item">
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}