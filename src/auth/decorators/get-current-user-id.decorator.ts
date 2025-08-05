import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ActiveUserData } from '../interfaces';

export const GetUseID = createParamDecorator(
  (_data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ActiveUserData;

    return user['sub'];
  },
);
