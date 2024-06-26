import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
