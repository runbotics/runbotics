import { Controller, Get } from '@nestjs/common';
import { UserService } from '#/scheduler-database/user/user.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { AuthUserDtoSchema } from '#/auth/dto/auth-user.dto';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@Controller('api')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Get('account')
    @FeatureKeys(FeatureKey.TENANT_READ_USER, FeatureKey.PROCESS_ADD_GUEST)
    async getAccount(@UserDecorator() { email }: User) {
        return AuthUserDtoSchema.parse(await this.userService.findByEmailForAuth(email));
    }
}
