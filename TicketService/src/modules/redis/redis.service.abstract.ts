import { Injectable } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export abstract class RedisClientBase {
  protected redis: Redis;
}
