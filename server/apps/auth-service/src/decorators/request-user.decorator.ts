import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//This decorator is used to extract the user object from the request object in  controller function.
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);