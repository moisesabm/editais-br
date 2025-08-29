# Editais BR - Portal Nacional de Editais Públicos

Portal web para publicação e consulta de editais públicos, desenvolvido como MVP da plataforma completa Editais BR.

## 📋 Funcionalidades MVP

### ✅ Implementadas
- **Sistema de Autenticação**: Login com dados de demonstração
- **Cadastro de Usuários**: Pessoa Física e Jurídica com validação completa
- **Consulta de Editais**: Busca e filtros por seção, órgão e palavra-chave
- **Sistema de Favoritos**: Salvar editais para consulta posterior
- **Interface Responsiva**: Design mobile-first com cores branco/azul
- **Dados Mockados**: Simulação realista para demonstração

### 🚀 Em Desenvolvimento (Funcionalidades Futuras)
- Sistema de pagamento integrado
- Publicação de editais com editor avançado
- Notificações personalizadas
- App mobile iOS e Android
- Escaneamento de documentos
- Importação automática do DOU
- Relatórios e analytics

## 🎨 Design

- **Cores Principais**: Branco predominante com azul (#4A6EBF) nos componentes
- **Tipografia**: Clean e legível
- **Responsivo**: Mobile-first approach
- **Acessibilidade**: Boas práticas implementadas

## 🛠 Tecnologias

- **React 18** com TypeScript
- **React Router** para navegação
- **React Hook Form** para formulários
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas
- **CSS Modules** com variáveis CSS customizadas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
# Navegar para o diretório do projeto
cd editais-br-web

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 📱 Dados de Demonstração

Para testar o sistema, use os seguintes dados:

**Login:**
- Email: `demo@editaisbr.com`
- Senha: `demo123`

**Funcionalidades Disponíveis:**
- Consulta de editais com filtros
- Sistema de favoritos
- Cadastro de novos usuários
- Interface responsiva

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Navegação principal
│   └── Header.css
├── contexts/            # Contextos React
│   └── AuthContext.tsx # Gerenciamento de autenticação
├── pages/              # Páginas principais
│   ├── Home.tsx        # Página inicial
│   ├── Login.tsx       # Login
│   ├── Register.tsx    # Cadastro
│   ├── Editais.tsx     # Consulta de editais
│   ├── Favoritos.tsx   # Favoritos do usuário
│   └── *.css          # Estilos das páginas
├── styles/             # Estilos globais
│   └── global.css      # Variáveis CSS e estilos base
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
└── App.tsx            # Componente principal
```

## 🔐 Segurança

- Validação de formulários no frontend
- Sanitização de dados de entrada
- Armazenamento seguro no localStorage
- Preparado para integração com backend seguro

## 📈 Roadmap

### Fase 2 (Próximos Passos)
- [ ] Integração com backend real
- [ ] Sistema de publicação de editais
- [ ] Processamento de pagamentos
- [ ] Notificações em tempo real

### Fase 3 (Futuro)
- [ ] App mobile React Native
- [ ] Integração com APIs governamentais
- [ ] Sistema avançado de relatórios
- [ ] Autenticação biométrica

## Available Scripts

### `npm start`
Executa o app em modo de desenvolvimento em [http://localhost:3000](http://localhost:3000)

### `npm test`
Inicia o test runner em modo interativo

### `npm run build`
Cria o build de produção na pasta `build`

### `npm run eject`
**Atenção: operação irreversível!** Remove as abstrações do Create React App

## 🤝 Contribuição

Este é um MVP demonstrativo. Para sugestões ou melhorias:

1. Crie uma issue descrevendo a funcionalidade
2. Faça um fork do projeto
3. Implemente as mudanças
4. Envie um pull request

## 📄 Licença

Este projeto é uma demonstração do sistema Editais BR. Direitos reservados.

---

**Nota**: Este é um MVP demonstrativo com dados simulados. A versão de produção incluirá integração completa com backend, sistema de pagamentos e todas as funcionalidades avançadas descritas no documento de especificação.
