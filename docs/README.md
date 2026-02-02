# 📚 Documentação da API - Sistema de Autenticação

## 📋 Visão Geral

Esta documentação descreve todos os endpoints que o back-end precisa implementar para funcionar com o front-end Angular.

## 🎯 Base URL

```
http://localhost:3000/api
```

> **Nota:** Configure esta URL no arquivo `src/environments/environment.ts` do front-end.

## 🔐 Endpoints Disponíveis

| Método | Endpoint | Descrição | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/register` | Registra um novo usuário | ❌ |
| POST | `/login` | Realiza login e retorna tokens | ❌ |
| POST | `/logout` | Remove refresh token e desloga | ❌ |
| POST | `/refresh` | Renova o access token | ❌ |
| GET | `/me` | Retorna dados do usuário autenticado | ✅ |

## 📝 Documentação Detalhada

Clique nos links abaixo para ver a documentação completa de cada endpoint:

- [POST /register](./register_API.md) - Cadastro de novo usuário
- [POST /login](./login_API.md) - Login e geração de tokens
- [POST /logout](./logout_API.md) - Logout e remoção de tokens
- [POST /refresh](./refresh_API.md) - Renovação do access token
- [GET /me](./me_API.md) - Dados do usuário autenticado

## 🛠 Stack Tecnológica do Back-End

### Obrigatórias
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com tokens (jsonwebtoken)
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

### Recomendadas
- **Swagger** - Documentação automática (@nestjs/swagger)
- **Docker + Docker Compose** - Containerização
- **dotenv** - Variáveis de ambiente

## 🗄 Estrutura do Banco de Dados

### Tabela: `users`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email do usuário |
| password | VARCHAR(255) | NOT NULL | Hash da senha (bcrypt) |
| created_at | TIMESTAMP | DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | DEFAULT NOW() | Data de atualização |

### Tabela: `refresh_tokens`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| token_hash | VARCHAR(255) | NOT NULL | Hash do refresh token |
| user_id | UUID | FOREIGN KEY | Referência ao usuário |
| expires_at | TIMESTAMP | NOT NULL | Data de expiração |
| created_at | TIMESTAMP | DEFAULT NOW() | Data de criação |
| is_revoked | BOOLEAN | DEFAULT FALSE | Token revogado |

## 🔒 Segurança

### Tokens JWT

#### Access Token
- **Expiração:** 15 minutos
- **Payload:**
  ```json
  {
    "sub": "user-id",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234568790
  }
  ```
- **Armazenamento:** Client-side (sessionStorage)

#### Refresh Token
- **Expiração:** 7 dias
- **Payload:**
  ```json
  {
    "sub": "user-id",
    "type": "refresh",
    "iat": 1234567890,
    "exp": 1235172690
  }
  ```
- **Armazenamento:** Banco de dados (hash)

### Hash de Senha

Use **bcrypt** com salt rounds = 10:

```typescript
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### Validação de Token

```typescript
// No header Authorization
Authorization: Bearer <access_token>
```

## 📦 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=auth_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🐳 Docker Compose (Exemplo)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: auth_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: auth_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: auth_api
    ports:
      - '3000:3000'
    environment:
      DATABASE_HOST: postgres
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## 🚀 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar migrations
npm run migration:run

# Iniciar servidor em desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Rodar em produção
npm run start:prod

# Gerar migration
npm run migration:generate -- -n MigrationName

# Docker
docker-compose up -d
```

## ✅ Checklist de Implementação

### Configuração Inicial
- [ ] Criar projeto NestJS
- [ ] Configurar TypeORM
- [ ] Configurar PostgreSQL
- [ ] Configurar variáveis de ambiente
- [ ] Configurar CORS

### Módulos
- [ ] Criar módulo de autenticação
- [ ] Criar módulo de usuários
- [ ] Criar DTOs
- [ ] Criar Entities

### Endpoints
- [ ] Implementar POST /register
- [ ] Implementar POST /login
- [ ] Implementar POST /logout
- [ ] Implementar POST /refresh
- [ ] Implementar GET /me

### Segurança
- [ ] Implementar hash de senha com bcrypt
- [ ] Implementar geração de JWT tokens
- [ ] Implementar validação de JWT
- [ ] Implementar guards de autenticação
- [ ] Implementar rate limiting

### Documentação
- [ ] Configurar Swagger
- [ ] Documentar todos os endpoints
- [ ] Adicionar exemplos de requisições

### Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E

### Deploy
- [ ] Configurar Docker
- [ ] Configurar CI/CD
- [ ] Deploy em produção

## 📞 Suporte

Para dúvidas sobre o front-end ou integração, consulte:
- [AUTH-README.md](../AUTH-README.md) - Documentação completa do front-end
- [QUICKSTART.md](../QUICKSTART.md) - Guia rápido de inicialização

---

**Desenvolvido para integração com Angular 15 + NestJS** 🚀
