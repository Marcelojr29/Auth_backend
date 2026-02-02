import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Verifica se o email já existe
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Cria o usuário
    await this.usersService.create(email, hashedPassword);

    return {
      message: 'Usuário cadastrado com sucesso',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Busca usuário pelo email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Valida senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera tokens
    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Access Token (15 minutos)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Refresh Token (7 dias)
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Salva refresh token no banco (com hash)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const refreshTokenEntity = this.refreshTokensRepository.create({
      tokenHash: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      isRevoked: false,
    });

    await this.refreshTokensRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token é obrigatório');
    }

    try {
      // Verifica se o token é válido
      const payload = this.jwtService.verify(refreshToken);

      // Busca todos os refresh tokens do usuário no banco
      const tokens = await this.refreshTokensRepository.find({
        where: {
          userId: payload.sub,
          isRevoked: false,
        },
      });

      // Procura o token que corresponde ao hash
      let tokenFound = false;
      for (const tokenEntity of tokens) {
        const isMatch = await bcrypt.compare(
          refreshToken,
          tokenEntity.tokenHash,
        );

        if (isMatch) {
          tokenFound = true;
          // Remove o token do banco
          await this.refreshTokensRepository.delete(tokenEntity.id);
          break;
        }
      }

      if (!tokenFound) {
        throw new UnauthorizedException('Refresh token não encontrado');
      }

      return {
        message: 'Logout realizado com sucesso',
      };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token é obrigatório');
    }

    try {
      // Verifica se o token é válido
      const payload = this.jwtService.verify(refreshToken);

      // Verifica se é um refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // Busca o usuário
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Busca todos os refresh tokens ativos do usuário
      const tokens = await this.refreshTokensRepository.find({
        where: {
          userId: user.id,
          isRevoked: false,
        },
      });

      // Verifica se o token existe no banco
      let tokenFound = false;
      for (const tokenEntity of tokens) {
        const isMatch = await bcrypt.compare(
          refreshToken,
          tokenEntity.tokenHash,
        );

        if (isMatch) {
          // Verifica se não expirou
          if (new Date() > tokenEntity.expiresAt) {
            throw new UnauthorizedException('Refresh token expirado');
          }

          tokenFound = true;
          break;
        }
      }

      if (!tokenFound) {
        throw new UnauthorizedException(
          'Refresh token não encontrado ou foi revogado',
        );
      }

      // Gera novo access token
      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
        },
        {
          expiresIn: '15m',
        },
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Refresh token inválido');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expirado');
      }
      throw error;
    }
  }
}
