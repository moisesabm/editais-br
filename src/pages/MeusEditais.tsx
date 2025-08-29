import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserEditais, updateEditalViews } from '../services/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Edital {
  id: string;
  title: string;
  number?: string;
  organ?: string;
  type?: string;
  value?: string;
  openingDate?: string;
  closingDate?: string;
  description?: string;
  status: 'draft' | 'published';
  createdAt: any;
  views?: number;
  userId: string;
}

const MeusEditais: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadUserEditais();
  }, [user, navigate]);

  const loadUserEditais = async () => {
    if (!user) return;
    
    try {
      const userEditais = await getUserEditais(user.uid);
      
      // Converter Timestamp do Firebase para Date, se necessário
      const editaisFormatted = userEditais.map((edital: any) => ({
        ...edital,
        createdAt: edital.createdAt?.toDate ? edital.createdAt.toDate() : new Date(edital.createdAt),
      }));
      
      setEditais(editaisFormatted);
    } catch (error) {
      console.error('Error loading user editais:', error);
      // Fallback para dados mockados se Firebase falhar
      setEditais([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEditais = editais.filter(edital => {
    const matchesSearch = edital.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edital.organ?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edital.number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || edital.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const publishedEditais = filteredEditais.filter(e => e.status === 'published');
  const draftEditais = filteredEditais.filter(e => e.status === 'draft');

  const handleViewEdital = async (edital: Edital) => {
    if (edital.status === 'published') {
      // Incrementar visualizações se for publicado
      try {
        await updateEditalViews(edital.id);
      } catch (error) {
        console.error('Error updating views:', error);
      }
    }
    
    // Por enquanto, apenas mostrar detalhes (poderia abrir modal ou página)
    alert(`Visualizando: ${edital.title}\nStatus: ${edital.status === 'published' ? 'Publicado' : 'Rascunho'}`);
  };

  const handleEditEdital = (edital: Edital) => {
    // Redirecionar para página de edição (seria implementado futuramente)
    alert(`Funcionalidade de edição será implementada na próxima versão!\n\nEdital: ${edital.title}`);
  };

  const handleDeleteEdital = (edital: Edital) => {
    if (window.confirm(`Tem certeza que deseja excluir o edital "${edital.title}"?`)) {
      // Implementar exclusão no Firebase
      alert(`Funcionalidade de exclusão será implementada na próxima versão!\n\nEdital: ${edital.title}`);
    }
  };

  const handleShareEdital = (edital: Edital) => {
    if (edital.status === 'published') {
      // Simular compartilhamento
      navigator.clipboard.writeText(`Confira este edital: ${edital.title}`);
      alert('Link copiado para a área de transferência!');
    } else {
      alert('Apenas editais publicados podem ser compartilhados.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Editais</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os seus editais publicados e rascunhos</p>
        </div>
        
        <Button onClick={() => navigate('/publicar')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Edital
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar editais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="published">Publicados</option>
                <option value="draft">Rascunhos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Editais</p>
                <p className="text-2xl font-bold">{editais.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-green-600">{publishedEditais.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                <p className="text-2xl font-bold text-yellow-600">{draftEditais.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Editais */}
      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos ({editais.length})</TabsTrigger>
          <TabsTrigger value="published">Publicados ({publishedEditais.length})</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos ({draftEditais.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredEditais.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum edital encontrado</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Você ainda não publicou nenhum edital.'}
                </p>
                <Button onClick={() => navigate('/publicar')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Edital
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredEditais.map((edital) => (
                <Card key={edital.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{edital.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(edital.status)}`}>
                            {getStatusIcon(edital.status)}
                            {getStatusText(edital.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {edital.number && <p><strong>Número:</strong> {edital.number}</p>}
                          {edital.organ && <p><strong>Órgão:</strong> {edital.organ}</p>}
                          {edital.type && <p><strong>Tipo:</strong> {edital.type}</p>}
                          {edital.value && <p><strong>Valor:</strong> R$ {edital.value}</p>}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Criado em {format(edital.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                          {edital.status === 'published' && edital.views !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {edital.views} visualizações
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEdital(edital)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEdital(edital)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {edital.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareEdital(edital)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEdital(edital)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {/* Mesmo conteúdo mas apenas publicados */}
          <div className="grid gap-4">
            {publishedEditais.map((edital) => (
              <Card key={edital.id} className="hover:shadow-md transition-shadow">
                {/* Mesmo layout do card acima */}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{edital.title}</h3>
                        <span className="px-2 py-1 text-xs rounded-full flex items-center gap-1 bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                          Publicado
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {edital.number && <p><strong>Número:</strong> {edital.number}</p>}
                        {edital.organ && <p><strong>Órgão:</strong> {edital.organ}</p>}
                        {edital.type && <p><strong>Tipo:</strong> {edital.type}</p>}
                        {edital.value && <p><strong>Valor:</strong> R$ {edital.value}</p>}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Publicado em {format(edital.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {edital.views || 0} visualizações
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleViewEdital(edital)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShareEdital(edital)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {/* Mesmo conteúdo mas apenas rascunhos */}
          <div className="grid gap-4">
            {draftEditais.map((edital) => (
              <Card key={edital.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{edital.title}</h3>
                        <span className="px-2 py-1 text-xs rounded-full flex items-center gap-1 bg-yellow-100 text-yellow-800">
                          <Clock className="h-4 w-4" />
                          Rascunho
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {edital.number && <p><strong>Número:</strong> {edital.number}</p>}
                        {edital.organ && <p><strong>Órgão:</strong> {edital.organ}</p>}
                        {edital.type && <p><strong>Tipo:</strong> {edital.type}</p>}
                        {edital.value && <p><strong>Valor:</strong> R$ {edital.value}</p>}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Salvo em {format(edital.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditEdital(edital)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEdital(edital)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeusEditais;