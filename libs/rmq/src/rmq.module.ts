import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

export interface RmqModuleOptions {
  name: string;
  queue: string;
  urls?: string[];
}

@Global()
@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(options: RmqModuleOptions[]): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync({
          // isGlobal:true,
          clients:options.map(option=> ({
            name: option.name,
            useFactory: () => ({
              transport: Transport.RMQ,
              options: {
                urls: option.urls || ['amqp://localhost:5672'],
                queue: option.queue,
              },
            }),
          })),
        }),
      ],
      exports: [ClientsModule],
    };
  }
}