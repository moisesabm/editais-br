import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEdital } from '../services/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Save,
  Send
} from 'lucide-react';

const PublishEdital: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    number: '',
    type: 'licitacao',
    organ: '',
    section: 'licitacoes',
    value: '',
    openingDate: '',
    closingDate: '',
    description: '',
    requirements: '',
    documents: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    status: 'draft'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDraft = async () => {
    if (!user) {
      alert('Você precisa estar logado para salvar um rascunho');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await createEdital({
        ...formData,
        userId: user.uid,
        status: 'draft'
      });
      alert('Rascunho salvo com sucesso!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Erro ao salvar rascunho');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      alert('Você precisa estar logado para publicar');
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.organ || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await createEdital({
        ...formData,
        userId: user.uid,
        status: 'published',
        publishedAt: new Date().toISOString()
      });
      
      alert('Edital publicado com sucesso!');
      navigate('/editais');
    } catch (error) {
      console.error('Error publishing:', error);
      alert('Erro ao publicar edital');
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pré-visualização do Edital</CardTitle>
              <Button variant="outline" onClick={() => setPreview(false)}>
                Voltar para Edição
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{formData.title || 'Título do Edital'}</h2>
                <p className="text-gray-600">Edital nº {formData.number || 'XXX/2024'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Órgão</p>
                  <p className="font-medium">{formData.organ || 'Nome do Órgão'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">{formData.type === 'licitacao' ? 'Licitação' : formData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Estimado</p>
                  <p className="font-medium">R$ {formData.value || '0,00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Período de Inscrições</p>
                  <p className="font-medium">
                    {formData.openingDate || 'DD/MM/AAAA'} até {formData.closingDate || 'DD/MM/AAAA'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.description || 'Descrição detalhada do edital...'}
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Requisitos</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.requirements || 'Requisitos para participação...'}
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={handlePublish} disabled={loading} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Publicar Edital
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Publicar Novo Edital</CardTitle>
          <CardDescription>
            Preencha as informações do edital para publicação oficial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="requirements">Requisitos</TabsTrigger>
              <TabsTrigger value="review">Revisar</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título do Edital *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Edital de Licitação para Construção de Escola"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Número do Edital *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 001/2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tipo de Edital *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="licitacao">Licitação</option>
                      <option value="concurso">Concurso Público</option>
                      <option value="pregao">Pregão Eletrônico</option>
                      <option value="chamamento">Chamamento Público</option>
                      <option value="aviso">Aviso</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Órgão Responsável *
                  </label>
                  <input
                    type="text"
                    name="organ"
                    value={formData.organ}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Prefeitura Municipal de São Paulo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Seção
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="licitacoes">Licitações</option>
                      <option value="concursos">Concursos</option>
                      <option value="avisos">Avisos</option>
                      <option value="portarias">Portarias</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor Estimado
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 500.000,00"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setActiveTab('details')}
                  className="ml-auto"
                >
                  Próximo: Detalhes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Data de Abertura
                    </label>
                    <input
                      type="date"
                      name="openingDate"
                      value={formData.openingDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Data de Encerramento
                    </label>
                    <input
                      type="date"
                      name="closingDate"
                      value={formData.closingDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Descreva detalhadamente o objeto do edital..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Rua das Flores, 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estado
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="PR">Paraná</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="BA">Bahia</option>
                      <option value="PE">Pernambuco</option>
                      <option value="CE">Ceará</option>
                      <option value="PA">Pará</option>
                      <option value="AM">Amazonas</option>
                      <option value="GO">Goiás</option>
                      <option value="DF">Distrito Federal</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('info')}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('requirements')}
                    className="ml-auto"
                  >
                    Próximo: Requisitos
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Requisitos para Participação
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Liste os requisitos necessários para participação..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Documentos Necessários
                  </label>
                  <textarea
                    name="documents"
                    value={formData.documents}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Liste os documentos necessários..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Informações de Contato
                  </label>
                  <textarea
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="E-mail, telefone, horário de atendimento..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Anexar Documentos</p>
                      <p className="text-sm text-blue-700 mt-1">
                        O sistema de upload de documentos estará disponível na próxima versão.
                        Por enquanto, você pode incluir links para documentos no campo de descrição.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('review')}
                    className="ml-auto"
                  >
                    Próximo: Revisar
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Quase pronto!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Revise todas as informações antes de publicar o edital.
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Edital</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <div>
                      <dt className="font-medium text-gray-600">Título:</dt>
                      <dd className="text-gray-900">{formData.title || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Número:</dt>
                      <dd className="text-gray-900">{formData.number || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Órgão:</dt>
                      <dd className="text-gray-900">{formData.organ || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Tipo:</dt>
                      <dd className="text-gray-900">{formData.type || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Valor:</dt>
                      <dd className="text-gray-900">R$ {formData.value || '0,00'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Período:</dt>
                      <dd className="text-gray-900">
                        {formData.openingDate || 'Não informado'} até {formData.closingDate || 'Não informado'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('requirements')}
                >
                  Voltar
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" onClick={() => setPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Pré-visualizar
                  </Button>
                  <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button onClick={handlePublish} disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    Publicar Edital
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishEdital;