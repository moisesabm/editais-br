import React, { useState, useEffect } from 'react';
import { Star, FileText, Calendar, Building2, Eye, Share2, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { Edital } from '../types';
import './Favoritos.css';

// Mock data - mesmo dados da página de editais
const mockEditais: Edital[] = [
    {
      id: '1',
      titulo: 'Edital de Concurso Público nº 001/2024',
      subtitulo: 'Abertura de vagas para diversos cargos',
      conteudo: 'O Município de São Paulo torna público a abertura de inscrições para o Concurso Público...',
      orgao: 'Prefeitura Municipal de São Paulo',
      orgaoSubordinado: 'Secretaria de Gestão',
      tipoAto: 'Concurso Público',
      secao: 'secao3',
      dataPublicacao: new Date('2024-01-15'),
      dataCriacao: new Date('2024-01-10'),
      status: 'publicado',
      autor: {
        id: '1',
        nome: 'João Silva',
        tipo: 'juridica'
      },
      tags: ['concurso', 'prefeitura', 'são paulo'],
      visualizacoes: 1234
    },
    {
      id: '2',
      titulo: 'Edital de Licitação - Pregão Eletrônico nº 045/2024',
      subtitulo: 'Aquisição de materiais de escritório',
      conteudo: 'O Governo do Estado do Rio de Janeiro, através da Secretaria de Administração...',
      orgao: 'Governo do Estado do Rio de Janeiro',
      tipoAto: 'Licitação',
      secao: 'secao3',
      dataPublicacao: new Date('2024-01-12'),
      dataCriacao: new Date('2024-01-08'),
      status: 'publicado',
      autor: {
        id: '2',
        nome: 'Maria Santos',
        tipo: 'juridica'
      },
      tags: ['licitação', 'pregão', 'rio de janeiro'],
      visualizacoes: 567
    }
];

export function Favoritos() {
  const { isAuthenticated } = useAuth();
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [editaisFavoritos, setEditaisFavoritos] = useState<Edital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavoritos = localStorage.getItem('@EditaisBR:favoritos');
    if (savedFavoritos) {
      const favoritosIds = JSON.parse(savedFavoritos);
      setFavoritos(favoritosIds);
      
      // Filtrar editais favoritados
      const editaisFavoritados = mockEditais.filter(edital => 
        favoritosIds.includes(edital.id)
      );
      setEditaisFavoritos(editaisFavoritados);
    }
    
    setIsLoading(false);
  }, []); // Removido mockEditais da dependência

  const removeFavorito = (editalId: string) => {
    const newFavoritos = favoritos.filter(id => id !== editalId);
    setFavoritos(newFavoritos);
    localStorage.setItem('@EditaisBR:favoritos', JSON.stringify(newFavoritos));
    
    setEditaisFavoritos(editaisFavoritos.filter(edital => edital.id !== editalId));
  };

  const shareEdital = (edital: Edital) => {
    if (navigator.share) {
      navigator.share({
        title: edital.titulo,
        text: edital.subtitulo,
        url: window.location.href.replace('/favoritos', '/editais/') + edital.id
      });
    } else {
      navigator.clipboard.writeText(window.location.href.replace('/favoritos', '/editais/') + edital.id);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getSectionName = (secao: string) => {
    const sections: { [key: string]: string } = {
      secao1: 'Atos Normativos',
      secao2: 'Atos de Pessoas',
      secao3: 'Contratos, Editais e Avisos',
      extra: 'Edição Extra'
    };
    return sections[secao] || secao;
  };

  const filteredEditais = editaisFavoritos.filter(edital =>
    edital.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edital.orgao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="favoritos-page">
        <div className="container">
          <div className="auth-required">
            <Star size={48} />
            <h2>Faça login para ver seus favoritos</h2>
            <p>Você precisa estar conectado para acessar seus editais favoritos</p>
            <a href="/login" className="btn btn-primary">
              Fazer Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Meus Favoritos</h1>
              <p>Editais que você salvou para consultar mais tarde</p>
            </div>
            <div className="header-stats">
              <div className="stat-badge">
                <Star size={20} />
                <span>{favoritos.length} editais salvos</span>
              </div>
            </div>
          </div>
        </div>

        {favoritos.length > 0 && (
          <div className="search-section">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar nos favoritos..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando favoritos...</p>
          </div>
        ) : filteredEditais.length === 0 ? (
          <div className="no-favorites">
            {favoritos.length === 0 ? (
              <>
                <Star size={48} />
                <h3>Você ainda não tem favoritos</h3>
                <p>Comece a favoritar editais para salvá-los aqui</p>
                <a href="/editais" className="btn btn-primary">
                  Explorar Editais
                </a>
              </>
            ) : (
              <>
                <Search size={48} />
                <h3>Nenhum favorito encontrado</h3>
                <p>Tente ajustar o termo de busca</p>
              </>
            )}
          </div>
        ) : (
          <div className="favoritos-grid">
            {filteredEditais.map(edital => (
              <div key={edital.id} className="favorito-card">
                <div className="favorito-header">
                  <span className="badge badge-blue">{getSectionName(edital.secao)}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFavorito(edital.id)}
                    title="Remover dos favoritos"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="favorito-title">{edital.titulo}</h3>
                {edital.subtitulo && (
                  <p className="favorito-subtitle">{edital.subtitulo}</p>
                )}

                <div className="favorito-meta">
                  <div className="meta-item">
                    <Building2 size={14} />
                    <span>{edital.orgao}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{format(edital.dataPublicacao, "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="meta-item">
                    <Eye size={14} />
                    <span>{edital.visualizacoes} views</span>
                  </div>
                </div>

                <div className="favorito-actions">
                  <button className="btn btn-primary btn-sm">
                    <FileText size={16} />
                    Ver Edital
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => shareEdital(edital)}
                  >
                    <Share2 size={16} />
                    Compartilhar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}