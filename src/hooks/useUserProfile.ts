import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/firebase';

interface UserProfile {
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  company?: string;
  role: string;
  memberSince: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // PRIORIDADE 1: Tentar carregar dados do Firebase primeiro
        console.log('Tentando carregar perfil do Firebase para usuário:', user.uid);
        const firebaseProfile = await getUserProfile(user.uid);
        
        if (firebaseProfile) {
          console.log('Dados encontrados no Firebase:', firebaseProfile);
          const profileData: UserProfile = {
            name: `${firebaseProfile.nome || ''} ${firebaseProfile.sobrenome || ''}`.trim() || 'Usuário',
            email: user.email || firebaseProfile.email || '',
            cpf: firebaseProfile.cpf,
            cnpj: firebaseProfile.cnpj,
            phone: firebaseProfile.telefone || '(11) 98765-4321',
            address: firebaseProfile.endereco?.rua ? 
              `${firebaseProfile.endereco.rua}, ${firebaseProfile.endereco.numero}` : 
              'Endereço não informado',
            city: firebaseProfile.endereco?.cidade || 'Cidade não informada',
            state: firebaseProfile.endereco?.estado || 'Estado não informado',
            zipCode: firebaseProfile.endereco?.cep || 'CEP não informado',
            company: firebaseProfile.nomeInstituicao,
            role: 'Usuário do Sistema',
            memberSince: new Date(firebaseProfile.updatedAt?.toDate?.() || Date.now()).getFullYear().toString()
          };
          
          setProfile(profileData);
          return;
        }
        
        console.log('Dados não encontrados no Firebase, tentando localStorage...');
        
        // PRIORIDADE 2: Tentar carregar dados do localStorage
        const storedUser = localStorage.getItem('@EditaisBR:user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Dados encontrados no localStorage:', userData);
          
          const profileData: UserProfile = {
            name: `${userData.nome || ''} ${userData.sobrenome || ''}`.trim() || 'Usuário',
            email: user.email || userData.email || '',
            cpf: userData.cpf,
            cnpj: userData.cnpj,
            phone: userData.telefone || '(11) 98765-4321',
            address: userData.endereco?.rua ? 
              `${userData.endereco.rua}, ${userData.endereco.numero}` : 
              'Rua das Flores, 123',
            city: userData.endereco?.cidade || 'São Paulo',
            state: userData.endereco?.estado || 'SP',
            zipCode: userData.endereco?.cep || '01234-567',
            company: userData.nomeInstituicao,
            role: 'Usuário do Sistema',
            memberSince: '2024'
          };
          
          setProfile(profileData);
          return;
        }

        console.log('Usando dados de fallback...');
        
        // PRIORIDADE 3: Fallback para dados do contexto ou dados padrão
        const profileData: UserProfile = {
          name: user.nome && user.sobrenome ? `${user.nome} ${user.sobrenome}` : 'João Silva',
          email: user.email || '',
          cpf: user.cpf,
          cnpj: user.cnpj,
          phone: user.telefone || '(11) 98765-4321',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          company: undefined,
          role: 'Usuário do Sistema',
          memberSince: '2024'
        };
        
        setProfile(profileData);
        
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        // Em caso de erro, usar dados básicos
        setProfile({
          name: 'João Silva',
          email: user.email || '',
          phone: '(11) 98765-4321',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          role: 'Usuário do Sistema',
          memberSince: '2024'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return { profile, loading };
}