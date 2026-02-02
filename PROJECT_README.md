# 🔐 Auth Back-End - Sistema de Autenticação Reutilizável

Sistema de autenticação completo desenvolvido com NestJS, TypeORM, PostgreSQL e JWT. Projetado para ser reutilizado em diferentes projetos e integrar perfeitamente com front-end Angular 15.

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Endpoints](#-endpoints)

## 🚀 Stack Tecnológica

- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com JSON Web Tokens
- **bcrypt** - Hash de senhas
- **Swagger** - Documentação automática da API
- **class-validator** - Validação de DTOs
- **Docker** - Containerização

## ✨ Funcionalidades

- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Geração de Access Token (15 minutos) e Refresh Token (7 dias)
- ✅ Renovação automática de Access Token
- ✅ Logout com remoção de Refresh Token
- ✅ Endpoint protegido para dados do usuário
- ✅ Validação de dados com class-validator
- ✅ Hash de senha com bcrypt
- ✅ Documentação automática com Swagger
- ✅ CORS configurado para Angular
- ✅ Docker Compose para desenvolvimento

## 📦 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 15+ (ou Docker)
- Git

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd auth-back
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

## ⚙️ Configuração

### Variáveis de Ambiente

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

> ⚠️ **IMPORTANTE**: Em produção, altere o `JWT_SECRET` para uma chave segura!

## 🎯 Executando o Projeto

### Opção 1: Com Docker (Recomendado)

```bash
# Iniciar PostgreSQL e aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar containers
docker-compose down
```

### Opção 2: Localmente

1. Inicie o PostgreSQL manualmente ou use Docker apenas para o banco:
```bash
docker-compose up -d postgres
```

2. Execute a aplicação:
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

## 📚 Documentação da API

Acesse a documentação interativa do Swagger em:
```
http://localhost:3000/api/docs
```

Ou consulte a documentação detalhada na pasta `docs/`:
- [README.md](docs/README.md) - Visão geral
- [register_API.md](docs/register_API.md) - Registro de usuário
- [login_API.md](docs/login_API.md) - Login
- [logout_API.md](docs/logout_API.md) - Logout
- [refresh_API.md](docs/refresh_API.md) - Refresh token
- [me_API.md](docs/me_API.md) - Dados do usuário

## 📁 Estrutura do Projeto

```
auth-back/
├── src/
│   ├── auth/
│   │   ├── dto/                    # Data Transfer Objects
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
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── docs/                           # Documentação da API
├── docker-compose.yml
├── Dockerfile
├── .env
├── .env.example
└── package.json
```

## 🔗 Endpoints

### Autenticação (Público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Registrar novo usuário |
| POST | `/api/login` | Fazer login |
| POST | `/api/logout` | Fazer logout |
| POST | `/api/refresh` | Renovar access token |

### Usuário (Protegido)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/me` | Dados do usuário | Bearer Token |

## 🔐 Segurança

- **Senhas**: Hasheadas com bcrypt (salt rounds: 10)
- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias, armazenado como hash no banco
- **CORS**: Configurado para aceitar apenas origem do front-end
- **Validação**: Todos os inputs são validados com class-validator
- **TypeORM**: Synchronize desabilitado em produção

## 🧪 Testando a API

### Com cURL

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'

# Obter dados do usuário (substitua TOKEN pelo access token)
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer TOKEN"
```

### Com Swagger

Acesse http://localhost:3000/api/docs e teste todos os endpoints diretamente na interface.

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Lint
npm run lint

# Testes
npm run test
npm run test:e2e
npm run test:cov
```

## 🐳 Docker

### Apenas PostgreSQL
```bash
docker-compose up -d postgres
```

### Aplicação completa
```bash
docker-compose up -d
```

### Logs
```bash
docker-compose logs -f
```

### Parar
```bash
docker-compose down
```

### Remover volumes
```bash
docker-compose down -v
```

## 🔄 Integração com Front-End Angular

Este back-end foi projetado para funcionar perfeitamente com o front-end Angular 15. Configure no front-end:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 📈 Melhorias Futuras

- [ ] Implementar rate limiting
- [ ] Adicionar refresh token rotation
- [ ] Implementar migrations do TypeORM
- [ ] Adicionar testes unitários e E2E
- [ ] Implementar recuperação de senha
- [ ] Adicionar autenticação de dois fatores
- [ ] Implementar roles e permissões

## 👨‍💻 Desenvolvimento

Desenvolvido para ser reutilizável em múltiplos projetos. Sinta-se livre para adaptar conforme suas necessidades.

## 📄 Licença

Este projeto é livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ usando NestJS**
