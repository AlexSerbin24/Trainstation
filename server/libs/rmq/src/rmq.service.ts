import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor() {}

  static getOptions(urls:string[], queue:string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls,
        queue,
        noAck,
        persistent: true,
      },
    };
  }

}