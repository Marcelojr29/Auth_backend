# 🎯 QUICKSTART - Sistema de Autenticação

## ✅ Status do Projeto

**TUDO PRONTO E FUNCIONANDO!** 🚀

A aplicação está rodando em: **http://localhost:3000**
Documentação Swagger: **http://localhost:3000/api/docs**

## 📋 O que foi implementado

### ✅ Back-End Completo
- [x] NestJS com TypeScript configurado
- [x] PostgreSQL rodando no Docker (porta 5432)
- [x] TypeORM configurado e tabelas criadas automaticamente
- [x] JWT com Access Token (15min) e Refresh Token (7 dias)
- [x] bcrypt para hash de senhas (salt rounds: 10)
- [x] Swagger para documentação automática
- [x] CORS configurado para Angular (localhost:4200)
- [x] ValidationPipe global para validações

### ✅ Endpoints Implementados

1. **POST /api/register** - Cadastro de usuário
   - Valida email único
   - Hash da senha com bcrypt
   - Retorna sucesso ou erro 409

2. **POST /api/login** - Login
   - Valida credenciais
   - Gera Access Token (15 min)
   - Gera Refresh Token (7 dias)
   - Salva hash do refresh token no banco

3. **POST /api/logout** - Logout
   - Remove refresh token do banco
   - Invalida sessão

4. **POST /api/refresh** - Renovar token
   - Valida refresh token
   - Gera novo access token
   - Mantém refresh token ativo

5. **GET /api/me** - Dados do usuário (PROTEGIDO)
   - Requer Bearer Token
   - Retorna id e email do usuário

### ✅ Banco de Dados

Tabelas criadas automaticamente:
- **users** (id, email, password, created_at, updated_at)
- **refresh_tokens** (id, token_hash, user_id, expires_at, is_revoked, created_at)

## 🚀 Como usar

### 1. Testar com Swagger (Recomendado)

Acesse: http://localhost:3000/api/docs

1. Clique em **POST /api/register** → Try it out
2. Digite um email e senha (mín. 8 caracteres)
3. Execute
4. Faça login em **POST /api/login**
5. Copie o `accessToken`
6. No topo da página, clique em **Authorize**
7. Cole o token no formato: `Bearer SEU_TOKEN`
8. Agora pode testar **GET /api/me**

### 2. Testar com cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'

# 2. Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'

# Resposta vai ter accessToken e refreshToken
# Copie o accessToken

# 3. Obter dados do usuário
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"

# 4. Refresh token
curl -X POST http://localhost:3000/api/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"SEU_REFRESH_TOKEN_AQUI"}'

# 5. Logout
curl -X POST http://localhost:3000/api/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"SEU_REFRESH_TOKEN_AQUI"}'
```

### 3. Conectar com Front-End Angular

No seu projeto Angular, configure:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Todos os endpoints já estão prontos e seguindo a documentação da pasta `docs/`.

## 🛑 Comandos úteis

```bash
# Ver logs da aplicação
# (A aplicação já está rodando no terminal)

# Parar a aplicação
# Pressione Ctrl+C no terminal onde está rodando

# Parar o PostgreSQL
docker-compose down

# Reiniciar tudo
docker-compose up -d postgres
npm run start:dev

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Acessar PostgreSQL
docker exec -it auth_postgres psql -U postgres -d auth_db

# Ver tabelas no PostgreSQL
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\dt"

# Ver usuários cadastrados
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT id, email, created_at FROM users;"

# Ver refresh tokens
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT id, user_id, expires_at, is_revoked FROM refresh_tokens;"
```

## 📂 Estrutura de arquivos criada

```
auth-back/
├── src/
│   ├── auth/
│   │   ├── dto/                    ✅ Todos os DTOs (register, login, logout, refresh)
│   │   ├── entities/               ✅ RefreshToken entity
│   │   ├── guards/                 ✅ JwtAuthGuard
│   │   ├── strategies/             ✅ JwtStrategy
│   │   ├── auth.controller.ts      ✅ Todos os endpoints
│   │   ├── auth.module.ts          ✅ JWT e Passport configurados
│   │   └── auth.service.ts         ✅ Toda a lógica de autenticação
│   ├── users/
│   │   ├── entities/               ✅ User entity
│   │   ├── users.module.ts         ✅ Users module
│   │   └── users.service.ts        ✅ CRUD de usuários
│   ├── app.module.ts               ✅ TypeORM e Config configurados
│   └── main.ts                     ✅ CORS, Validation e Swagger
├── docs/                           ✅ Documentação completa da API
├── .env                            ✅ Variáveis de ambiente
├── .env.example                    ✅ Exemplo para copiar
├── docker-compose.yml              ✅ PostgreSQL containerizado
├── Dockerfile                      ✅ Build da aplicação
└── PROJECT_README.md               ✅ Documentação do projeto

```

## 🔐 Segurança Implementada

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ Refresh tokens armazenados como hash no banco
- ✅ Access token com expiração curta (15 min)
- ✅ Refresh token com expiração longa (7 dias)
- ✅ CORS restrito ao front-end
- ✅ Validação de todos os inputs
- ✅ JWT com secret configurável
- ✅ Constraint UNIQUE no email
- ✅ Foreign key com CASCADE DELETE

## 🎓 Próximos passos

1. **Testar todos os endpoints** no Swagger
2. **Conectar com o front-end Angular**
3. **Ajustar conforme necessário** para seu projeto específico
4. **Em produção:**
   - Mudar JWT_SECRET para algo seguro
   - Desabilitar synchronize do TypeORM
   - Usar migrations
   - Adicionar HTTPS
   - Configurar rate limiting

## ❤️ Projeto Reutilizável

Este projeto foi desenvolvido para ser reutilizado em múltiplos projetos. Para usar em um novo projeto:

1. Copie a pasta `auth-back`
2. Mude o JWT_SECRET no `.env`
3. Ajuste o nome do banco de dados se necessário
4. Rode `docker-compose up -d` e `npm run start:dev`
5. Pronto! Sistema de autenticação completo funcionando

## 📞 Suporte

Consulte a documentação em:
- **docs/README.md** - Visão geral completa
- **Swagger** - http://localhost:3000/api/docs
- **PROJECT_README.md** - Guia completo do projeto

---

**Tudo funcionando! Bons códigos! 🚀**
