import { Module, Global, DynamicModule, Type } from '@nestjs/common';
import { RedisClientBase } from './redis.service.abstract';

@Global()
@Module({})
export class RedisModule {
  static forRoot(redisClients: { name?: string; useClass?: Type<RedisClientBase> }[]): DynamicModule {
    const providers = redisClients.map(client => ({
      provide: client.name,
      useClass: client.useClass,
    }));

    return {
      module: RedisModule,
      providers: providers,
      exports: providers.map(provider => provider.provide),
    };

  }
}