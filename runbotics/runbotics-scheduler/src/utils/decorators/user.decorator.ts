import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { UserEntity } from '#/database/user/user.entity';

export const User = createParamDecorator(
    (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
