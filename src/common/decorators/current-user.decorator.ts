import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../identity/user/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): any => {
    const request = ctx
      .switchToHttp()
      .getRequest<import('express').Request & { user: User }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
