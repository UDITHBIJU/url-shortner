import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;
    const emailInUse = await this.userRepository.findOne({
      where: { email },
    });

    if (emailInUse) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.cleanUpExpiredTokens(user.id);

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        expiresAt: MoreThan(new Date()), // Check if the token is still valid}
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.cleanUpExpiredTokens(token.userId);

    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days
    let newRefreshToken = refreshToken;

    if (token.expiresAt < twoDaysFromNow) {
      await this.refreshTokenRepository.remove(token);
      newRefreshToken = await this.generateRefreshToken(token.userId);
    }
    const accessToken = await this.generateAccessToken(token.userId);
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.sign({ userId }, { expiresIn: '1h' });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = uuidv4();
    await this.storeRefreshToken(userId, refreshToken);
    return refreshToken;
  }

  async storeRefreshToken(userId: string, token: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 5);
    const refreshToken = this.refreshTokenRepository.create({
      token,
      expiresAt: expiryDate,
      userId,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  private async cleanUpExpiredTokens(userId?: string) {
    try {
      const now = new Date();
      const where: any = { expiresAt: LessThan(now) };
      if (userId) {
        where.userId = userId;
      }
      await this.refreshTokenRepository.delete(where);
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
    }
  }
}
