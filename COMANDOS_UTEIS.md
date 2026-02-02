# 🛠️ Comandos Úteis - Auth Back-End

## 🚀 Iniciar Projeto

```bash
# Iniciar apenas o PostgreSQL
docker-compose up -d postgres

# Iniciar aplicação em desenvolvimento
npm run start:dev

# Iniciar aplicação em produção
npm run build
npm run start:prod

# Iniciar tudo com Docker
docker-compose up -d
```

## 🔍 Verificar Status

```bash
# Ver containers rodando
docker ps

# Ver logs da aplicação (se rodando no Docker)
docker-compose logs -f app

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Verificar conexão com banco
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\l"
```

## 🗃️ Comandos do Banco de Dados

```bash
# Conectar ao PostgreSQL
docker exec -it auth_postgres psql -U postgres -d auth_db

# Ver todas as tabelas
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\dt"

# Ver estrutura da tabela users
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\d users"

# Ver estrutura da tabela refresh_tokens
docker exec -it auth_postgres psql -U postgres -d auth_db -c "\d refresh_tokens"

# Ver todos os usuários
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT id, email, created_at FROM users;"

# Ver todos os refresh tokens
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT id, user_id, expires_at, is_revoked FROM refresh_tokens;"

# Contar usuários
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT COUNT(*) FROM users;"

# Ver usuário específico por email
docker exec -it auth_postgres psql -U postgres -d auth_db -c "SELECT * FROM users WHERE email = 'teste@example.com';"

# Deletar todos os usuários (CUIDADO!)
docker exec -it auth_postgres psql -U postgres -d auth_db -c "TRUNCATE TABLE users CASCADE;"
```

## 🧪 Testar Endpoints

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha12345678"}'

# Salvar tokens em variáveis
ACCESS_TOKEN="cole_aqui_o_access_token"
REFRESH_TOKEN="cole_aqui_o_refresh_token"
```

### Obter Dados do Usuário (Protegido)
```bash
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Renovar Access Token
```bash
curl -X POST http://localhost:3000/api/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

### Logout
```bash
curl -X POST http://localhost:3000/api/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

## 🧹 Limpeza

```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes (DELETA O BANCO!)
docker-compose down -v

# Remover containers órfãos
docker-compose down --remove-orphans

# Limpar build do NestJS
rm -rf dist/

# Limpar node_modules
rm -rf node_modules/
npm install
```

## 🔧 Desenvolvimento

```bash
# Instalar nova dependência
npm install nome-do-pacote

# Instalar dependência de desenvolvimento
npm install --save-dev nome-do-pacote

# Atualizar dependências
npm update

# Ver dependências desatualizadas
npm outdated

# Build do projeto
npm run build

# Lint do código
npm run lint

# Formatar código (se configurado prettier)
npm run format
```

## 📊 Monitoramento

```bash
# Ver uso de CPU e memória dos containers
docker stats

# Ver espaço usado pelos volumes
docker system df -v

# Ver logs em tempo real
docker-compose logs -f --tail=100

# Ver apenas erros nos logs
docker-compose logs | grep ERROR
```

## 🔐 Backup e Restore

```bash
# Fazer backup do banco
docker exec -it auth_postgres pg_dump -U postgres auth_db > backup.sql

# Restaurar banco de backup
docker exec -i auth_postgres psql -U postgres -d auth_db < backup.sql

# Backup com timestamp
docker exec -it auth_postgres pg_dump -U postgres auth_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🐛 Debug

```bash
# Ver variáveis de ambiente carregadas
docker exec -it auth_postgres env

# Testar conexão com banco
docker exec -it auth_postgres pg_isready -U postgres

# Ver processos rodando no container
docker exec -it auth_postgres ps aux

# Entrar no bash do container
docker exec -it auth_postgres bash

# Ver portas abertas
netstat -an | grep 3000
netstat -an | grep 5432
```

## 📦 Build e Deploy

```bash
# Build da imagem Docker
docker build -t auth-api .

# Rodar imagem buildada
docker run -p 3000:3000 --env-file .env auth-api

# Push para registry (após configurar)
docker tag auth-api seu-registry/auth-api:v1.0.0
docker push seu-registry/auth-api:v1.0.0
```

## 🎯 Comandos Rápidos do Dia a Dia

```bash
# Setup inicial (primeira vez)
cp .env.example .env
npm install
docker-compose up -d postgres
npm run start:dev

# Começar a trabalhar (todos os dias)
docker-compose up -d postgres
npm run start:dev

# Verificar se está tudo funcionando
curl http://localhost:3000
# Deve retornar: Hello World!

# Ver Swagger
open http://localhost:3000/api/docs
# ou
start http://localhost:3000/api/docs

# Parar tudo ao final do dia
# Ctrl+C no terminal do npm
docker-compose down
```

## 🔄 Reset Completo

```bash
# Resetar TUDO (banco, build, etc)
docker-compose down -v
rm -rf dist/
rm -rf node_modules/
npm install
docker-compose up -d postgres
npm run start:dev
```

## 📱 Verificação de Saúde

```bash
# Check se API está respondendo
curl http://localhost:3000

# Check se Swagger está acessível
curl http://localhost:3000/api/docs

# Check se PostgreSQL está aceitando conexões
docker exec -it auth_postgres psql -U postgres -c "SELECT version();"
```

## 🎓 Dicas

1. **Sempre rode `docker-compose up -d postgres` antes de iniciar a app**
2. **Use o Swagger para testar** - muito mais fácil que cURL
3. **Salve os tokens** em variáveis de ambiente para facilitar testes
4. **Consulte os logs** quando algo der errado
5. **Faça backup** antes de fazer mudanças grandes no banco

## ⚠️ Cuidados

- **NUNCA** rode `docker-compose down -v` em produção (perde dados!)
- **SEMPRE** mude o `JWT_SECRET` antes de fazer deploy
- **NÃO** commite o arquivo `.env` no git
- **TESTE** no Swagger antes de integrar com front-end

---

**💡 Dica:** Adicione os comandos mais usados como scripts no `package.json`!
