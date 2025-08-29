import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Building2, FileText, Star, 
  ChevronDown, Eye, Share2, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edital } from '../types';
import { getEditais, updateEditalViews } from '../services/firebase';
import './Editais.css';

// Função auxiliar para mapear seções
const mapSectionToSecao = (section: string): 'secao1' | 'secao2' | 'secao3' | 'extra' => {
  const mapping: { [key: string]: 'secao1' | 'secao2' | 'secao3' | 'extra' } = {
    'licitacoes': 'secao3',
    'concursos': 'secao1', 
    'avisos': 'secao2',
    'portarias': 'secao1'
  };
  return mapping[section] || 'secao3';
};

export function Editais() {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [filteredEditais, setFilteredEditais] = useState<Edital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecao, setSelectedSecao] = useState('');
  const [selectedOrgao, setSelectedOrgao] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Carregar editais (Firebase + Mock data)
  useEffect(() => {
    const loadEditais = async () => {
      try {
        // Tentar carregar editais do Firebase
        const firebaseEditais = await getEditais();
        
        // Converter dados do Firebase para o formato esperado
        const formattedFirebaseEditais: Edital[] = firebaseEditais
          .filter((edital: any) => edital.status === 'published') // Apenas publicados
          .map((edital: any) => ({
            id: edital.id,
            titulo: edital.title || 'Título não informado',
            subtitulo: `${edital.type || 'Tipo não informado'} - ${edital.number || 'S/N'}`,
            conteudo: edital.description || 'Descrição não informada',
            orgao: edital.organ || 'Órgão não informado',
            orgaoSubordinado: undefined,
            tipoAto: edital.type || 'Tipo não informado',
            secao: mapSectionToSecao(edital.section || 'licitacoes'),
            dataPublicacao: edital.publishedAt ? new Date(edital.publishedAt) : new Date(),
            dataCriacao: edital.createdAt?.toDate ? edital.createdAt.toDate() : new Date(),
            status: 'publicado',
            autor: {
              id: edital.userId || 'unknown',
              nome: 'Usuário do Sistema',
              tipo: 'juridica'
            },
            tags: [edital.type?.toLowerCase(), edital.organ?.toLowerCase()].filter(Boolean),
            visualizacoes: edital.views || 0,
            valor: edital.value ? parseFloat(edital.value.replace(/[^\d,]/g, '').replace(',', '.')) : undefined
          }));

        console.log('Editais carregados do Firebase:', formattedFirebaseEditais.length);
        
        // Mock data para demonstração (manter alguns para demonstração)
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
      },
      {
        id: '3',
        titulo: 'Convocação de Assembleia Geral Ordinária',
        subtitulo: 'Sindicato dos Trabalhadores em Educação',
        conteudo: 'O Sindicato dos Trabalhadores em Educação convoca todos os associados...',
        orgao: 'SINTEED - Sindicato dos Trabalhadores em Educação',
        tipoAto: 'Assembleia',
        secao: 'secao2',
        dataPublicacao: new Date('2024-01-10'),
        dataCriacao: new Date('2024-01-05'),
        status: 'publicado',
        autor: {
          id: '3',
          nome: 'Carlos Oliveira',
          tipo: 'juridica'
        },
        tags: ['sindicato', 'assembleia', 'educação'],
        visualizacoes: 234
      },
      {
        id: '4',
        titulo: 'Portaria nº 234/2024',
        subtitulo: 'Nomeação de servidores aprovados em concurso',
        conteudo: 'O Ministério da Saúde, no uso de suas atribuições legais...',
        orgao: 'Ministério da Saúde',
        tipoAto: 'Portaria',
        secao: 'secao1',
        dataPublicacao: new Date('2024-01-08'),
        dataCriacao: new Date('2024-01-03'),
        status: 'publicado',
        autor: {
          id: '4',
          nome: 'Ana Costa',
          tipo: 'juridica'
        },
        tags: ['portaria', 'nomeação', 'ministério'],
        visualizacoes: 890
      },
      {
        id: '5',
        titulo: 'Edital de Citação - Processo nº 0001234-56.2024',
        subtitulo: 'Ação de Cobrança',
        conteudo: 'O Juízo da 2ª Vara Cível da Comarca de Belo Horizonte...',
        orgao: 'Tribunal de Justiça de Minas Gerais',
        tipoAto: 'Citação',
        secao: 'secao2',
        dataPublicacao: new Date('2024-01-05'),
        dataCriacao: new Date('2024-01-02'),
        status: 'publicado',
        autor: {
          id: '5',
          nome: 'Pedro Alves',
          tipo: 'fisica'
        },
        tags: ['citação', 'judicial', 'minas gerais'],
        visualizacoes: 123
      }
        ];

        // Combinar editais do Firebase com mock data
        const allEditais = [...formattedFirebaseEditais, ...mockEditais];
        
        // Remover duplicatas baseado no ID
        const uniqueEditais = allEditais.filter((edital, index, self) => 
          index === self.findIndex(e => e.id === edital.id)
        );

        console.log('Total de editais (Firebase + Mock):', uniqueEditais.length);
        
        setEditais(uniqueEditais);
        setFilteredEditais(uniqueEditais);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Erro ao carregar editais do Firebase:', error);
        
        // Fallback para mock data apenas
        const mockEditais: Edital[] = [
          // ... (mesmos dados mockados)
        ];
        
        setEditais(mockEditais);
        setFilteredEditais(mockEditais);
        setIsLoading(false);
      }
    };

    loadEditais();
    
    // Carregar favoritos do localStorage
    const savedFavoritos = localStorage.getItem('@EditaisBR:favoritos');
    if (savedFavoritos) {
      setFavoritos(JSON.parse(savedFavoritos));
    }
  }, []);

  useEffect(() => {
    let filtered = [...editais];

    if (searchTerm) {
      filtered = filtered.filter(edital => 
        edital.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSecao) {
      filtered = filtered.filter(edital => edital.secao === selectedSecao);
    }

    if (selectedOrgao) {
      filtered = filtered.filter(edital => 
        edital.orgao.toLowerCase().includes(selectedOrgao.toLowerCase())
      );
    }

    setFilteredEditais(filtered);
  }, [searchTerm, selectedSecao, selectedOrgao, editais]);

  const toggleFavorito = (editalId: string) => {
    const newFavoritos = favoritos.includes(editalId)
      ? favoritos.filter(id => id !== editalId)
      : [...favoritos, editalId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem('@EditaisBR:favoritos', JSON.stringify(newFavoritos));
  };

  const handleViewEdital = async (edital: Edital) => {
    try {
      // Incrementar visualizações no Firebase se não for um edital mockado
      if (!['1', '2', '3', '4', '5'].includes(edital.id)) {
        await updateEditalViews(edital.id);
        
        // Atualizar o estado local
        setEditais(prev => prev.map(e => 
          e.id === edital.id ? { ...e, visualizacoes: (e.visualizacoes || 0) + 1 } : e
        ));
        setFilteredEditais(prev => prev.map(e => 
          e.id === edital.id ? { ...e, visualizacoes: (e.visualizacoes || 0) + 1 } : e
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar visualizações:', error);
    }
    
    // Por enquanto, apenas mostrar alert - futuramente abriria modal ou página
    alert(`Visualizando edital completo:\n\n${edital.titulo}\n\nÓrgão: ${edital.orgao}\nTipo: ${edital.tipoAto}\n\n${edital.conteudo}`);
  };

  const shareEdital = (edital: Edital) => {
    if (navigator.share) {
      navigator.share({
        title: edital.titulo,
        text: edital.subtitulo,
        url: window.location.href + '/' + edital.id
      });
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href + '/' + edital.id);
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

  return (
    <div className="editais-page">
      <div className="container">
        <div className="page-header">
          <h1>Consultar Editais</h1>
          <p>Encontre editais públicos de todos os setores</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Busque por palavra-chave, órgão, tipo de edital..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filtros
              <ChevronDown size={16} className={showFilters ? 'rotate-180' : ''} />
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Seção</label>
                  <select
                    value={selectedSecao}
                    onChange={(e) => setSelectedSecao(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todas as seções</option>
                    <option value="secao1">Seção 1 - Atos Normativos</option>
                    <option value="secao2">Seção 2 - Atos de Pessoas</option>
                    <option value="secao3">Seção 3 - Contratos, Editais e Avisos</option>
                    <option value="extra">Edição Extra</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Órgão</label>
                  <input
                    type="text"
                    placeholder="Nome do órgão"
                    className="filter-input"
                    value={selectedOrgao}
                    onChange={(e) => setSelectedOrgao(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    className="filter-input"
                    disabled
                  />
                  <span className="coming-soon-label">Em breve</span>
                </div>

                <div className="filter-group">
                  <label>Data Final</label>
                  <input
                    type="date"
                    className="filter-input"
                    disabled
                  />
                  <span className="coming-soon-label">Em breve</span>
                </div>
              </div>

              <div className="filters-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSecao('');
                    setSelectedOrgao('');
                  }}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="results-info">
          <span className="results-count">
            {filteredEditais.length} {filteredEditais.length === 1 ? 'edital encontrado' : 'editais encontrados'}
          </span>
          <div className="sort-options">
            <select className="sort-select">
              <option>Mais recentes</option>
              <option>Mais antigos</option>
              <option>Mais visualizados</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando editais...</p>
          </div>
        ) : filteredEditais.length === 0 ? (
          <div className="no-results">
            <FileText size={48} />
            <h3>Nenhum edital encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca</p>
          </div>
        ) : (
          <div className="editais-list">
            {filteredEditais.map(edital => (
              <div key={edital.id} className="edital-card">
                <div className="edital-header">
                  <div className="edital-meta">
                    <span className="badge badge-blue">{getSectionName(edital.secao)}</span>
                    <span className="edital-date">
                      <Calendar size={14} />
                      {format(edital.dataPublicacao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    <span className="edital-views">
                      <Eye size={14} />
                      {edital.visualizacoes} visualizações
                    </span>
                  </div>
                  <button
                    className={`favorite-btn ${favoritos.includes(edital.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorito(edital.id)}
                  >
                    <Star size={20} />
                  </button>
                </div>

                <h3 className="edital-title">{edital.titulo}</h3>
                {edital.subtitulo && (
                  <p className="edital-subtitle">{edital.subtitulo}</p>
                )}

                <div className="edital-org">
                  <Building2 size={16} />
                  <span>{edital.orgao}</span>
                  {edital.orgaoSubordinado && (
                    <span className="org-subordinado">• {edital.orgaoSubordinado}</span>
                  )}
                </div>

                <p className="edital-preview">{edital.conteudo}</p>

                {edital.tags && edital.tags.length > 0 && (
                  <div className="edital-tags">
                    {edital.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="edital-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewEdital(edital)}
                  >
                    <Eye size={18} />
                    Ver Completo
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => shareEdital(edital)}
                  >
                    <Share2 size={18} />
                    Compartilhar
                  </button>
                  <button className="btn btn-outline">
                    <Download size={18} />
                    Baixar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button className="pagination-btn" disabled>
            Anterior
          </button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <span>...</span>
            <button className="pagination-number">10</button>
          </div>
          <button className="pagination-btn">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}