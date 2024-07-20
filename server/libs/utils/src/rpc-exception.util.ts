import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export async function handleRpcError(error: Error) {
  throw new RpcException({
    message: error.message,
    statusCode: error instanceof HttpException ? error.getStatus() : 500,
  });
}
