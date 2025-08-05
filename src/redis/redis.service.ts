import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import type Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  public async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.redisClient.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) === 1;
  }

  async incr(key: string): Promise<void> {
    await this.redisClient.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }
}
