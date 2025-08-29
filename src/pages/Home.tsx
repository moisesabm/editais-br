import React from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Bell, Star, Shield, Clock, TrendingUp, Users, BookOpen, Building2, Briefcase, Heart, ChevronRight } from 'lucide-react';
import './Home.css';

export function Home() {
  const stats = [
    { icon: FileText, label: 'Editais Publicados', value: '2.456', color: 'blue' },
    { icon: Users, label: 'Usuários Ativos', value: '1.234', color: 'green' },
    { icon: Building2, label: 'Órgãos Cadastrados', value: '89', color: 'purple' },
    { icon: TrendingUp, label: 'Consultas Hoje', value: '567', color: 'orange' }
  ];

  const sectors = [
    {
      title: '1º Setor',
      description: 'Órgãos Públicos',
      icon: Building2,
      color: 'blue',
      link: '/editais?setor=1'
    },
    {
      title: '2º Setor',
      description: 'Setor Privado',
      icon: Briefcase,
      color: 'green',
      link: '/editais?setor=2'
    },
    {
      title: '3º Setor',
      description: 'ONGs e Associações',
      icon: Heart,
      color: 'purple',
      link: '/editais?setor=3'
    }
  ];

  const sections = [
    { name: 'Atos Normativos', badge: 'Seção 1', count: 234 },
    { name: 'Atos de Pessoas', badge: 'Seção 2', count: 156 },
    { name: 'Contratos, Editais e Avisos', badge: 'Seção 3', count: 89 },
    { name: 'Edições Extras', badge: 'Extra', count: 12 }
  ];

  const upcomingFeatures = [
    'Sistema de pagamento integrado',
    'Notificações personalizadas',
    'App mobile iOS e Android',
    'Importação automática do DOU',
    'Editor avançado de editais',
    'Relatórios e analytics'
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Portal Nacional de <span className="text-primary">Editais Públicos</span>
            </h1>
            <p className="hero-subtitle">
              Acesse, publique e acompanhe editais de órgãos públicos, empresas privadas e organizações do terceiro setor em um único lugar.
            </p>
            
            <div className="hero-search">
              <div className="search-box">
                <Search className="search-icon-home" />
                <input
                  type="text"
                  placeholder="Busque por editais, órgãos, palavras-chave..."
                  className="search-input"
                />
                <Link to="/editais" className="btn btn-primary">
                  Buscar
                </Link>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/editais" className="btn btn-primary btn-lg">
                <FileText size={20} />
                Consultar Editais
              </Link>
              <Link to="/cadastro" className="btn btn-secondary btn-lg">
                <Users size={20} />
                Cadastre-se Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectors-section">
        <div className="container">
          <h2 className="section-title">Navegue por Setores</h2>
          <p className="section-subtitle">Encontre editais organizados por tipo de instituição</p>
          
          <div className="sectors-grid">
            {sectors.map((sector, index) => (
              <Link key={index} to={sector.link} className="sector-card">
                <div className={`sector-icon sector-icon-${sector.color}`}>
                  <sector.icon size={32} />
                </div>
                <h3 className="sector-title">{sector.title}</h3>
                <p className="sector-description">{sector.description}</p>
                <span className="sector-link">
                  Explorar <ChevronRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sections-section">
        <div className="container">
          <h2 className="section-title">Seções Disponíveis</h2>
          <p className="section-subtitle">Acesse editais organizados por categoria</p>
          
          <div className="sections-grid">
            {sections.map((section, index) => (
              <Link key={index} to={`/editais?secao=${index + 1}`} className="section-card">
                <div className="section-card-header">
                  <span className="badge badge-blue">{section.badge}</span>
                  <span className="section-count">{section.count} editais</span>
                </div>
                <h3 className="section-name">{section.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-info">
              <h2 className="section-title">Por que escolher o Editais BR?</h2>
              <div className="features-list">
                <div className="feature-item">
                  <Shield className="feature-icon" />
                  <div>
                    <h4>Seguro e Confiável</h4>
                    <p>Plataforma segura com autenticação de documentos</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Clock className="feature-icon" />
                  <div>
                    <h4>Atualização em Tempo Real</h4>
                    <p>Novos editais disponíveis assim que publicados</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Bell className="feature-icon" />
                  <div>
                    <h4>Notificações Inteligentes</h4>
                    <p>Receba alertas de editais do seu interesse</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Star className="feature-icon" />
                  <div>
                    <h4>Favoritos e Histórico</h4>
                    <p>Salve e acompanhe seus editais importantes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="coming-soon-card">
              <h3>Funcionalidades em Desenvolvimento</h3>
              <p>Estamos trabalhando para trazer ainda mais recursos:</p>
              <ul className="upcoming-list">
                {upcomingFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="coming-soon-footer">
                <BookOpen size={20} />
                <span>Acompanhe as novidades!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Comece a usar o Editais BR hoje mesmo</h2>
            <p>Cadastre-se gratuitamente e tenha acesso a todos os editais públicos</p>
            <div className="cta-buttons">
              <Link to="/cadastro" className="btn btn-primary btn-lg">
                Criar Conta Gratuita
              </Link>
              <Link to="/editais" className="btn btn-outline btn-lg">
                Explorar Editais
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}