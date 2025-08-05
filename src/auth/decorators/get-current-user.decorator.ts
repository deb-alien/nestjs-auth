import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ActiveUserData } from '../interfaces';

export const GetUser = createParamDecorator(
  (data: keyof ActiveUserData | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ActiveUserData;

    return data ? user?.[data] : user;
  },
);
