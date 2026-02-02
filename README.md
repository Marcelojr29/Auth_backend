# 🔐 Auth Back-End - Sistema de Autenticação Reutilizável

Sistema de autenticação completo e profissional desenvolvido com **NestJS**, **TypeORM**, **PostgreSQL** e **JWT**. Projetado para ser reutilizado em diferentes projetos e integrar perfeitamente com front-end Angular 15+.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Executando o Projeto](#-executando-o-projeto)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Segurança](#-segurança)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Docker](#-docker)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Licença](#-licença)

---

## ✨ Funcionalidades

- ✅ **Registro de usuários** com validação de email único
- ✅ **Login seguro** com email e senha
- ✅ **Geração de tokens JWT** (Access Token + Refresh Token)
- ✅ **Renovação automática** de Access Token via Refresh Token
- ✅ **Logout** com invalidação de tokens
- ✅ **Endpoint protegido** para dados do usuário autenticado
- ✅ **Hash de senhas** com bcrypt (salt rounds: 10)
- ✅ **Validação automática** de inputs com class-validator
- ✅ **Documentação interativa** com Swagger
- ✅ **CORS configurado** para integração com front-end
- ✅ **Docker Compose** para ambiente de desenvolvimento

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NestJS** | 10.x | Framework Node.js progressivo |
| **TypeORM** | 0.3.x | ORM para TypeScript |
| **PostgreSQL** | 15.x | Banco de dados relacional |
| **JWT** | - | JSON Web Tokens para autenticação |
| **bcrypt** | 5.x | Hash de senhas |
| **Swagger** | - | Documentação automática da API |
| **class-validator** | - | Validação de DTOs |
| **Docker** | - | Containerização |

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd auth-back
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações (veja [Variáveis de Ambiente](#-variáveis-de-ambiente)).

---

## 🎯 Executando o Projeto

### Opção 1: Com Docker (Recomendado)

```bash
# Iniciar PostgreSQL
docker-compose up -d postgres

# Iniciar aplicação
npm run start:dev
```

### Opção 2: Aplicação completa com Docker

```bash
# Iniciar PostgreSQL e aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### Opção 3: Localmente (sem Docker para aplicação)

1. Certifique-se de ter PostgreSQL rodando
2. Execute:

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará disponível em:
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs

---

## 📚 Documentação da API

### Swagger UI (Interativo)

Acesse a documentação interativa em:
```
http://localhost:3000/api/docs
```

### Documentação Markdown

Consulte a documentação detalhada na pasta `docs/`:
- [README.md](docs/README.md) - Visão geral completa
- [register_API.md](docs/register_API.md) - Registro de usuário
- [login_API.md](docs/login_API.md) - Login
- [logout_API.md](docs/logout_API.md) - Logout
- [refresh_API.md](docs/refresh_API.md) - Refresh token
- [me_API.md](docs/me_API.md) - Dados do usuário

---

## 🔗 Endpoints

### Autenticação (Público)

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/api/register` | Registrar novo usuário | `{ email, password }` |
| POST | `/api/login` | Fazer login | `{ email, password }` |
| POST | `/api/logout` | Fazer logout | `{ refreshToken }` |
| POST | `/api/refresh` | Renovar access token | `{ refreshToken }` |

### Usuário (Protegido)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/me` | Dados do usuário | Bearer Token |

### Exemplos de Requisição

#### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"senha12345678"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"senha12345678"}'
```

#### Obter Dados do Usuário
```bash
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

---

## 🔐 Segurança

### Autenticação JWT

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias

### Proteções Implementadas

✅ Senhas hasheadas com bcrypt (salt rounds: 10)  
✅ Refresh tokens armazenados como hash no banco  
✅ Access token com expiração curta  
✅ CORS configurado para aceitar apenas origem do front-end  
✅ Validação de todos os inputs com class-validator  
✅ Email único com constraint no banco de dados  
✅ Mensagens de erro genéricas (não expõe se email existe)  
✅ Guard JWT para rotas protegidas  

### Estrutura dos Tokens

**Access Token Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "iat": 1706788800,
  "exp": 1706789700
}
```

**Refresh Token Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "type": "refresh",
  "iat": 1706788800,
  "exp": 1707393600
}
```

---

## 📁 Estrutura do Projeto

```
auth-back/
├── src/
│   ├── auth/                      # Módulo de autenticação
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   ├── logout.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── entities/
│   │   │   └── refresh-token.entity.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts     # Todos os endpoints
│   │   ├── auth.module.ts
│   │   └── auth.service.ts        # Lógica de autenticação
│   ├── users/                     # Módulo de usuários
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts              # Módulo principal
│   └── main.ts                    # Entry point
├── docs/                          # Documentação da API
├── test/                          # Testes
├── docker-compose.yml             # Docker Compose
├── Dockerfile                     # Build da aplicação
├── .env                           # Variáveis de ambiente
├── .env.example                   # Template de variáveis
└── package.json
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=auth_db

# JWT
JWT_SECRET=minha-chave-secreta-super-segura-para-desenvolvimento-2026
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

> ⚠️ **IMPORTANTE**: Em produção, altere o `JWT_SECRET` para uma chave forte e única!

---

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar apenas PostgreSQL
docker-compose up -d postgres

# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes (DELETA O BANCO!)
docker-compose down -v

# Reconstruir imagens
docker-compose build
```

### Acessar PostgreSQL

```bash
# Via psql
docker exec -it auth_postgres psql -U postgres -d auth_db

# Ver tabelas
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\dt"

# Ver usuários
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT id, email FROM users;"
```

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 🚢 Deploy

### Preparação para Produção

Antes de fazer deploy, consulte o [CHECKLIST_PRODUCAO.md](CHECKLIST_PRODUCAO.md) e certifique-se de:

- [ ] Mudar `JWT_SECRET` para chave segura
- [ ] Configurar `NODE_ENV=production`
- [ ] Usar HTTPS
- [ ] Configurar variáveis de ambiente no servidor
- [ ] Desabilitar `synchronize` do TypeORM
- [ ] Implementar migrations
- [ ] Configurar rate limiting
- [ ] Adicionar monitoramento (logs, errors)

### Build para Produção

```bash
# Build
npm run build

# Rodar em produção
npm run start:prod
```

---

## 🔄 Integração com Front-End Angular

Este back-end foi projetado para funcionar perfeitamente com front-end Angular 15+.

Configure no front-end:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Todos os endpoints seguem a documentação na pasta `docs/` e são compatíveis com interceptors HTTP do Angular.

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia em modo watch
npm run start:debug      # Inicia com debug

# Build
npm run build            # Compila o projeto

# Produção
npm run start:prod       # Inicia em produção

# Qualidade de código
npm run lint             # Executa ESLint
npm run format           # Formata código com Prettier

# Testes
npm run test             # Testes unitários
npm run test:watch       # Testes em modo watch
npm run test:e2e         # Testes E2E
npm run test:cov         # Cobertura de testes
```

---

## 📈 Melhorias Futuras

- [ ] Implementar rate limiting
- [ ] Adicionar refresh token rotation
- [ ] Implementar migrations do TypeORM
- [ ] Adicionar testes unitários e E2E
- [ ] Implementar recuperação de senha
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar roles e permissões (RBAC)
- [ ] Adicionar upload de avatar
- [ ] Implementar OAuth2 (Google, GitHub)

---

## 🤝 Contribuindo

Este é um projeto reutilizável. Sinta-se livre para:
- Fazer fork do projeto
- Adaptar para suas necessidades
- Sugerir melhorias
- Reportar bugs

---

## 📄 Licença

Este projeto é livre para uso pessoal e comercial.

---

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando:
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)

---

## 📞 Documentação Adicional

- [QUICKSTART.md](QUICKSTART.md) - Guia de início rápido
- [COMANDOS_UTEIS.md](COMANDOS_UTEIS.md) - Comandos do dia a dia
- [CHECKLIST_PRODUCAO.md](CHECKLIST_PRODUCAO.md) - Antes de fazer deploy
- [PROJECT_README.md](PROJECT_README.md) - Documentação completa do projeto
- [RESUMO_FINAL.md](RESUMO_FINAL.md) - Visão geral e estatísticas

---

**🎉 Sistema de autenticação completo e pronto para uso!**
