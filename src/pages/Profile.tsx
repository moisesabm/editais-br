import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserMetrics } from '../services/firebase';
import { useUserProfile } from '../hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  FileText,
  Heart,
  Eye,
  TrendingUp,
  Edit,
  Lock,
  CreditCard,
  Bell,
  Shield
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const { profile, loading: profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Carregar apenas métricas do Firebase
        const metricsData = await getUserMetrics(user.uid);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error loading metrics:', error);
        // Para métricas, usar valores padrão
        setMetrics({
          totalEditais: 0,
          totalFavorites: 0,
          totalViews: 0,
          averageViews: 0,
          engagementRate: '0',
          last7Days: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login');
      return;
    }

    loadData();
  }, [user, navigate]);


  const pieData = [
    { name: 'Publicados', value: metrics?.totalEditais || 0, color: '#4A6EBF' },
    { name: 'Favoritados', value: metrics?.totalFavorites || 0, color: '#60A5FA' },
  ];

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Profile Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=4A6EBF&color=fff`} />
              <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="text-gray-600 mt-1">{profile?.role || 'Usuário'}</p>
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {profile?.email}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {profile?.phone}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Membro desde {profile?.memberSince}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" disabled className="gap-2">
                <Edit className="h-4 w-4" />
                Editar Perfil
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full ml-2">Em breve</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Editais Publicados</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalEditais || 0}</div>
                <p className="text-xs text-muted-foreground">Total de editais criados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalFavorites || 0}</div>
                <p className="text-xs text-muted-foreground">Editais salvos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalViews || 0}</div>
                <p className="text-xs text-muted-foreground">Total de views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.engagementRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Média de interações</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
                <CardDescription>Visualizações e favoritos diários</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics?.last7Days || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#4A6EBF" 
                      strokeWidth={2}
                      name="Visualizações"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="favorites" 
                      stroke="#60A5FA" 
                      strokeWidth={2}
                      name="Favoritos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Atividades</CardTitle>
                <CardDescription>Proporção entre publicados e favoritados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Information Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados cadastrais completos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{profile?.name}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">CPF</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>{profile?.cpf}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">E-mail</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{profile?.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Telefone</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{profile?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Endereço</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Endereço</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile?.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Cidade/Estado</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile?.city}, {profile?.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {profile?.company && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Informações Empresariais</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Empresa</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{profile?.company}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">CNPJ</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>{profile?.cnpj}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Alterar Senha</p>
                    <p className="text-sm text-gray-600">Última alteração há 30 dias</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Alterar
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full ml-2">Em breve</span>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Configurar
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full ml-2">Em breve</span>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Notificações de Segurança</p>
                    <p className="text-sm text-gray-600">Receba alertas sobre atividades suspeitas</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Ativar
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full ml-2">Em breve</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>Gerencie sua assinatura e benefícios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Plano Básico</h3>
                    <p className="text-gray-600">Gratuito</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="flex items-center gap-2 text-sm">
                    ✓ Visualizar editais públicos
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    ✓ Salvar até 10 favoritos
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    ✓ Publicar 1 edital por mês
                  </p>
                </div>
                
                <Button className="w-full" disabled>
                  Fazer Upgrade
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full ml-2">Em breve</span>
                </Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4 opacity-60">
                  <h4 className="font-bold mb-2">Plano Profissional</h4>
                  <p className="text-2xl font-bold text-primary mb-3">R$ 49,90/mês</p>
                  <ul className="space-y-1 text-sm">
                    <li>✓ Editais ilimitados</li>
                    <li>✓ Favoritos ilimitados</li>
                    <li>✓ Notificações personalizadas</li>
                    <li>✓ Relatórios avançados</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 opacity-60">
                  <h4 className="font-bold mb-2">Plano Empresarial</h4>
                  <p className="text-2xl font-bold text-primary mb-3">R$ 199,90/mês</p>
                  <ul className="space-y-1 text-sm">
                    <li>✓ Tudo do Profissional</li>
                    <li>✓ Multi-usuários</li>
                    <li>✓ API de integração</li>
                    <li>✓ Suporte prioritário</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;