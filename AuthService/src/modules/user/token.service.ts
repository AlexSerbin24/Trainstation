import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}


  async findTokenByRefreshToken(refreshToken: string) {
    return await this.tokenRepository.findOne({ where: { refreshToken } });
  }

  async saveToken(userId: number, refreshToken: string) {
    let token = await this.tokenRepository.findOne({ where: { userId } });
  
    if (!token) {
      token = new Token();
      token.userId = userId;
    }
  
    token.refreshToken = refreshToken;
    return await this.tokenRepository.save(token);
  }

  async deleteToken(refreshToken: string) {
    await this.tokenRepository.delete({ refreshToken });
  }

  generateAccessToken(userId: number, email: string): string {
    return this.jwtService.sign({ userId, email }, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '2h' });
  }

  generateRefreshToken(userId: number, email: string): string {
    return this.jwtService.sign({ userId, email }, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' });
  }

  
  validateAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken, { secret: process.env.ACCESS_TOKEN_SECRET })
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {  secret: process.env.REFRESH_TOKEN_SECRET })
    } catch (error) {
      return null;
    }
  }
}
