import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { User as UserEntity } from '#/scheduler-database/user/user.entity';

export const User = createParamDecorator(
    (userProperty: keyof UserEntity | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;

        return userProperty ? user?.[userProperty] : user;
    },
);
