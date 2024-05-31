import { Redis } from 'ioredis';

export abstract class RedisClientBase {
  protected redis: Redis;
}
