import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  createUser, 
  loginUser, 
  logoutUser, 
  saveUserProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from '../services/firebase';
import { LoginCredentials, RegisterDataPessoaFisica, RegisterDataPessoaJuridica } from '../types';

interface User {
  uid: string;
  email: string | null;
  nome?: string;
  sobrenome?: string;
  tipo?: 'fisica' | 'juridica';
  cpf?: string;
  cnpj?: string;
  telefone?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerPessoaFisica: (data: RegisterDataPessoaFisica) => Promise<void>;
  registerPessoaJuridica: (data: RegisterDataPessoaJuridica) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const initializeAuth = async () => {
      try {
        if (auth && auth.app) {
          console.log('Firebase configurado, usando Firebase Auth');
          setUseFirebase(true);
          
          // Listen to Firebase auth state changes
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log('Firebase auth state changed:', firebaseUser?.uid);
            
            if (firebaseUser) {
              // Usuário autenticado no Firebase
              const userData: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
              };
              
              // Salvar no localStorage também para persistência híbrida
              localStorage.setItem('@EditaisBR:user', JSON.stringify(userData));
              localStorage.setItem('@EditaisBR:token', 'firebase-token');
              
              setUser(userData);
            } else {
              // Usuário não autenticado no Firebase - verificar localStorage
              console.log('Usuário não autenticado no Firebase, verificando localStorage...');
              
              const storedUser = localStorage.getItem('@EditaisBR:user');
              const storedToken = localStorage.getItem('@EditaisBR:token');
              
              if (storedUser && storedToken) {
                console.log('Dados encontrados no localStorage, mantendo sessão');
                setUser(JSON.parse(storedUser));
              } else {
                console.log('Nenhuma sessão encontrada');
                setUser(null);
              }
            }
            setIsLoading(false);
          });
          
        } else {
          throw new Error('Firebase não configurado');
        }
      } catch (error) {
        console.log('Firebase não configurado ou com erro, usando localStorage:', error);
        setUseFirebase(false);
        
        // Fallback to localStorage only
        const storedUser = localStorage.getItem('@EditaisBR:user');
        const storedToken = localStorage.getItem('@EditaisBR:token');
        
        if (storedUser && storedToken) {
          console.log('Carregando usuário do localStorage');
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      if (useFirebase) {
        // Use Firebase authentication
        const firebaseUser = await loginUser(credentials.email, credentials.senha);
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        };
        
        // Salvar no localStorage também para backup
        localStorage.setItem('@EditaisBR:user', JSON.stringify(userData));
        localStorage.setItem('@EditaisBR:token', 'firebase-token');
        
        setUser(userData);
        console.log('Login Firebase realizado com sucesso:', userData.uid);
      } else {
        // Fallback to mock login
        const mockUser: User = {
          uid: '1',
          email: credentials.email,
          nome: 'João',
          sobrenome: 'Silva',
          tipo: 'fisica',
          cpf: '123.456.789-00',
          telefone: '(11) 98765-4321',
        };

        localStorage.setItem('@EditaisBR:user', JSON.stringify(mockUser));
        localStorage.setItem('@EditaisBR:token', 'mock-jwt-token');
        
        setUser(mockUser);
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // If Firebase login fails, try mock login for demo account
      if (credentials.email === 'demo@editaisbr.com' && credentials.senha === 'demo123') {
        const mockUser: User = {
          uid: '1',
          email: credentials.email,
          nome: 'João',
          sobrenome: 'Silva',
          tipo: 'fisica',
          cpf: '123.456.789-00',
          telefone: '(11) 98765-4321',
        };

        localStorage.setItem('@EditaisBR:user', JSON.stringify(mockUser));
        localStorage.setItem('@EditaisBR:token', 'mock-jwt-token');
        
        setUser(mockUser);
      } else {
        throw new Error(error.message || 'Falha ao realizar login');
      }
    }
  };

  const logout = async () => {
    try {
      if (useFirebase) {
        await logoutUser();
      }
      localStorage.removeItem('@EditaisBR:user');
      localStorage.removeItem('@EditaisBR:token');
      localStorage.removeItem('@EditaisBR:favorites');
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const registerPessoaFisica = async (data: RegisterDataPessoaFisica) => {
    try {
      if (useFirebase) {
        // Create user in Firebase
        const firebaseUser = await createUser(data.email, data.senha);
        
        // Save additional profile data
        await saveUserProfile(firebaseUser.uid, {
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'fisica',
          cpf: data.cpf,
          telefone: data.telefone,
          endereco: data.endereco,
          dataNascimento: data.dataNascimento,
          estadoCivil: data.estadoCivil,
          publicaEditais: data.publicaEditais
        });

        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'fisica',
          cpf: data.cpf,
          telefone: data.telefone,
        };
        
        setUser(userData);
      } else {
        // Fallback to mock registration
        const mockUser: User = {
          uid: Date.now().toString(),
          email: data.email,
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'fisica',
          cpf: data.cpf,
          telefone: data.telefone,
        };

        localStorage.setItem('@EditaisBR:user', JSON.stringify(mockUser));
        localStorage.setItem('@EditaisBR:token', 'mock-jwt-token');
        
        setUser(mockUser);
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw new Error(error.message || 'Falha ao realizar cadastro');
    }
  };

  const registerPessoaJuridica = async (data: RegisterDataPessoaJuridica) => {
    try {
      if (useFirebase) {
        // Create user in Firebase
        const firebaseUser = await createUser(data.email, data.senha);
        
        // Save additional profile data
        await saveUserProfile(firebaseUser.uid, {
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'juridica',
          cnpj: data.cnpj,
          telefone: data.telefone,
          endereco: data.endereco,
          dataNascimento: data.dataNascimento,
          estadoCivil: data.estadoCivil,
          publicaEditais: data.publicaEditais,
          nomeInstituicao: data.nomeInstituicao,
          inscricaoEstadual: data.inscricaoEstadual
        });

        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'juridica',
          cnpj: data.cnpj,
          telefone: data.telefone,
        };
        
        setUser(userData);
      } else {
        // Fallback to mock registration
        const mockUser: User = {
          uid: Date.now().toString(),
          email: data.email,
          nome: data.nome,
          sobrenome: data.sobrenome,
          tipo: 'juridica',
          cnpj: data.cnpj,
          telefone: data.telefone,
        };

        localStorage.setItem('@EditaisBR:user', JSON.stringify(mockUser));
        localStorage.setItem('@EditaisBR:token', 'mock-jwt-token');
        
        setUser(mockUser);
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw new Error(error.message || 'Falha ao realizar cadastro');
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        registerPessoaFisica,
        registerPessoaJuridica
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}