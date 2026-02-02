# 👤 GET /me - Dados do Usuário Autenticado

## 📋 Descrição

Endpoint protegido que retorna os dados do usuário autenticado. Requer um access token válido no header Authorization.

## 🔗 Endpoint

```
GET /api/me
```B

## 🔐 Autenticação

**✅ REQUER AUTENTICAÇÃO** - Access Token no header


## 📥 Request

### Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Sem Body

Este endpoint não aceita body na requisição.

## 📤 Response

### Sucesso (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com"
}
```

### Erro - Token não fornecido (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Token não fornecido",
  "error": "Unauthorized"
}
```

### Erro - Token inválido (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

### Erro - Usuário não encontrado (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Usuário não encontrado",
  "error": "Not Found"
}
```

### Erro - Servidor (500 Internal Server Error)

```json
{
  "statusCode": 500,
  "message": "Erro ao buscar dados do usuário",
  "error": "Internal Server Error"
}
```

## 💻 Implementação NestJS

### Guard (JWT Auth Guard)

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }
}
```

### Strategy (JWT Strategy)

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub }
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email
    };
  }
}
```

### Controller

```typescript
// src/auth/auth.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário retornados' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  getMe(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email
    };
  }
}
```

### Auth Module Configuration

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
```

## 🧪 Exemplos de Teste

### cURL

```bash
# Substitua YOUR_ACCESS_TOKEN pelo token real
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript (Fetch)

```javascript
const accessToken = sessionStorage.getItem('access_token');

const response = await fetch('http://localhost:3000/api/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

if (response.ok) {
  const user = await response.json();
  console.log('Usuário:', user);
} else {
  console.error('Erro ao buscar usuário');
}
```

### Postman

1. **Method:** GET
2. **URL:** `http://localhost:3000/api/me`
3. **Headers:**
   - `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Authorization Tab (alternativa):**
   - Type: Bearer Token
   - Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ✅ Validações Necessárias

### Backend
- [x] Token deve estar presente no header Authorization
- [x] Token deve ter formato "Bearer {token}"
- [x] Token deve ser um JWT válido
- [x] Token não deve estar expirado
- [x] Usuário do token deve existir no banco
- [x] Retornar apenas dados não sensíveis (sem senha)

### Frontend (já implementado)
- ✅ Interceptor adiciona token automaticamente
- ✅ Busca dados ao carregar página de perfil
- ✅ Observable para dados do usuário
- ✅ Tratamento de erro 401
- ✅ Tentativa de refresh automático

## 🔒 Segurança

1. **Nunca retorne a senha:** Exclua campos sensíveis da resposta
2. **Validação do token:** Use Passport JWT strategy
3. **Token expirado:** Retorne 401 para forçar refresh
4. **Dados mínimos:** Retorne apenas o necessário
5. **CORS:** Configure adequadamente para produção

## 📊 Status Codes

| Status | Descrição |
|--------|-----------|
| 200 | OK - Dados do usuário retornados |
| 401 | Unauthorized - Token inválido, expirado ou não fornecido |
| 404 | Not Found - Usuário não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## 🔄 Fluxo de Execução

```mermaid
graph TD
    A[Cliente envia GET /me] --> B{Header Authorization?}
    B -->|Não| C[Retornar 401]
    B -->|Sim| D{Token válido?}
    D -->|Não| C
    D -->|Sim| E{Token expirado?}
    E -->|Sim| C
    E -->|Não| F[Extrair user ID do payload]
    F --> G{Usuário existe?}
    G -->|Não| H[Retornar 404]
    G -->|Sim| I[Retornar dados do usuário]
```

## 🎯 Extensões Possíveis

### Adicionar mais campos ao retorno

```typescript
// Exemplo: adicionar data de criação e outros campos
return {
  id: req.user.id,
  email: req.user.email,
  createdAt: req.user.createdAt,
  // Adicione outros campos conforme necessário
};
```

### Criar DTOs de resposta

```typescript
// src/users/dto/user-response.dto.ts
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude() // Nunca expor a senha
  password: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
```

Use no controller:

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Request() req): UserResponseDto {
  return new UserResponseDto(req.user);
}
```

## 🐛 Troubleshooting

### Erro: "Token não fornecido" mas token está sendo enviado

**Causa:** Header Authorization pode estar mal formatado.

**Solução:** Certifique-se que está no formato: `Authorization: Bearer {token}` (com espaço).

### Erro: "Token inválido" mas token parece correto

**Causa:** JWT_SECRET pode estar diferente ou token foi gerado com outra chave.

**Solução:** Verifique se o JWT_SECRET é o mesmo usado no login.

### Erro: Loop de requisições

**Causa:** O interceptor do front-end pode estar tentando renovar token em loop.

**Solução:** Verifique se `/me` não está tentando renovar token caso falhe.

### Erro: CORS bloqueando requisição

**Causa:** CORS não está configurado para aceitar header Authorization.

**Solução:** Configure CORS para aceitar custom headers:

```typescript
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

**Anterior:** [← Refresh API](./refresh_API.md) | **Voltar:** [📚 README](./README.md)
