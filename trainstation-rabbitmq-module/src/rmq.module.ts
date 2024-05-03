// rmq.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

export interface RmqModuleOptions {
  name: string;
  queue: string;
  urls?: string[];
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(options: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: options.name,
            useFactory: () => ({
              transport: Transport.RMQ,
              options: {
                urls: options.urls || ['amqp://localhost:5672'],
                queue: options.queue,
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
