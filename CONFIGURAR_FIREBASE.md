# 🔥 Configuração do Firebase para Editais BR

## Passos para Configurar o Firebase (GRATUITO)

### 1. Criar Projeto no Firebase

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `editais-br` (ou outro de sua preferência)
4. Desative o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", ative:
   - Email/Senha (clique e ative)
4. Clique em "Salvar"

### 3. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de produção"
4. Selecione a localização: `southamerica-east1` (São Paulo)
5. Clique em "Ativar"

### 4. Configurar Regras do Firestore

No Firestore, vá em "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura pública de editais
    match /editais/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permite que usuários autenticados gerenciem seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Favoritos são privados do usuário
    match /favorites/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Clique em "Publicar"

### 5. Obter Credenciais do Projeto

1. Clique na engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role até "Seus aplicativos"
4. Clique no ícone `</>` (Web)
5. Nome do app: `Editais BR Web`
6. Clique em "Registrar app"
7. Copie as configurações que aparecem

### 6. Atualizar o Arquivo firebase.ts

Abra o arquivo `src/services/firebase.ts` e substitua as configurações mockadas pelas suas:

```javascript
const firebaseConfig = {
  apiKey: "SUA-API-KEY-AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 7. Testar a Aplicação

1. Reinicie a aplicação: `npm start`
2. Tente criar uma nova conta
3. Verifique no Firebase Console se o usuário foi criado

## 🎉 Pronto!

Agora sua aplicação está conectada ao Firebase com:
- ✅ Autenticação real de usuários
- ✅ Banco de dados Firestore
- ✅ Persistência de dados em tempo real
- ✅ Sistema multi-usuário funcional

## 💡 Dicas

- O plano gratuito do Firebase inclui:
  - 50.000 leituras/dia
  - 20.000 escritas/dia
  - 1GB de armazenamento
  - Autenticação ilimitada
  
- Para desenvolvimento, isso é mais que suficiente!

## 🚨 Importante

Se você não configurar o Firebase, a aplicação ainda funcionará usando localStorage como fallback, mas sem persistência real entre dispositivos.

## 📱 Funcionalidades com Firebase

Com o Firebase configurado, você terá:
1. Login/Cadastro real de usuários
2. Editais salvos no banco de dados
3. Favoritos sincronizados
4. Métricas reais no perfil
5. Sistema de publicação funcional
6. Dados acessíveis de qualquer dispositivo

## Suporte

Se tiver dúvidas na configuração, consulte:
- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)