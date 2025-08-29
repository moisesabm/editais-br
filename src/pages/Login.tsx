import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types';
import './Auth.css';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FileText size={40} className="auth-logo-icon" />
              <div className="auth-logo-text">
                <span className="logo-main">EDITAIS</span>
                <span className="logo-sub">BR</span>
              </div>
            </div>
            <h1 className="auth-title">Bem-vindo de volta!</h1>
            <p className="auth-subtitle">Entre com sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon"
                  placeholder="••••••••"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && <span className="form-error">{errors.senha.message}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Lembrar de mim</span>
              </label>
              <Link to="/recuperar-senha" className="form-link">
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <div className="auth-demo">
            <p className="demo-text">Dados de demonstração:</p>
            <div className="demo-credentials">
              <code>Email: demo@editaisbr.com</code>
              <code>Senha: demo123</code>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="auth-link">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Portal Nacional de Editais</h2>
            <p>Acesse milhares de editais públicos de forma rápida e organizada</p>
            
            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon">📄</div>
                <div>
                  <h4>Acesso Completo</h4>
                  <p>Consulte editais de todos os setores</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">🔔</div>
                <div>
                  <h4>Notificações</h4>
                  <p>Receba alertas de novos editais</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">⭐</div>
                <div>
                  <h4>Favoritos</h4>
                  <p>Salve editais importantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}