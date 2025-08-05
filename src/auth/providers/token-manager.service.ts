import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { TokenPayload, Tokens } from '../interfaces';
import { REFRESH_KEY } from './../../redis/constants.redis';
import { RedisService } from './../../redis/redis.service';

@Injectable()
export class TokenManager {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  public async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('ACCESS_SECRET'),
        expiresIn: this.config.get<number>('ACCESS_TTL'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('REFRESH_SECRET'),
        expiresIn: this.config.get<number>('REFRESH_TTL'),
      }),
    ]);
    return { access_token, refresh_token };
  }

  public async storeToken(id: string, token: string): Promise<void> {
    const key = `${REFRESH_KEY}:${id}`;
    await this.redisService.set(
      key,
      await hash(token, 10),
      this.config.get<number>('REFRESH_TTL'),
    );
  }

  public async validateToken(id: string, token: string): Promise<boolean> {
    const key = `${REFRESH_KEY}:${id}`;

    const storedToken = await this.redisService.get(key);
    if (!storedToken) return false;

    return await compare(token, storedToken);
  }

  public async invalidateToken(id: string): Promise<void> {
    const key = `${REFRESH_KEY}:${id}`;
    await this.redisService.del(key);
  }
}
