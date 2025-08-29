export interface User {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  tipo: 'fisica' | 'juridica';
  cpf?: string;
  cnpj?: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    estado: string;
    cidade: string;
  };
  dataNascimento?: Date;
  estadoCivil?: string;
  publicaEditais: boolean;
  nomeInstituicao?: string;
  inscricaoEstadual?: string;
}

export interface Edital {
  id: string;
  titulo: string;
  subtitulo?: string;
  conteudo: string;
  orgao: string;
  orgaoSubordinado?: string;
  tipoAto: string;
  secao: 'secao1' | 'secao2' | 'secao3' | 'extra';
  dataPublicacao: Date;
  dataCriacao: Date;
  status: 'publicado' | 'agendado' | 'rascunho' | 'pendente';
  autor: {
    id: string;
    nome: string;
    tipo: 'fisica' | 'juridica';
  };
  valor?: number;
  tags?: string[];
  visualizacoes: number;
}

export interface SearchFilters {
  termo?: string;
  secao?: string;
  dataInicio?: Date;
  dataFim?: Date;
  orgao?: string;
  tipoAto?: string;
  status?: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterDataPessoaFisica {
  nome: string;
  sobrenome: string;
  sexo: 'M' | 'F' | 'outro';
  telefone: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dataNascimento: string;
  estadoCivil: string;
  publicaEditais: boolean;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    estado: string;
    cidade: string;
  };
  aceitePolitica: boolean;
}

export interface RegisterDataPessoaJuridica extends RegisterDataPessoaFisica {
  nomeInstituicao: string;
  cnpj: string;
  inscricaoEstadual: string;
  documentos?: {
    cnpjDoc?: File;
    inscricaoEstadualDoc?: File;
    doc1?: File;
    doc2?: File;
    doc3?: File;
  };
  aceiteResponsabilidade: boolean;
}

export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  lida: boolean;
  dataEnvio: Date;
  link?: string;
}

export interface Section {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  ativa: boolean;
}

export interface Favorito {
  id: string;
  editalId: string;
  userId: string;
  dataFavoritado: Date;
}