import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '#/scheduler-database/user/user.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { AuthUserDtoSchema } from '#/auth/dto/auth-user.dto';
import { JwtAuthGuard } from '#/auth/guards';

@Controller('api')
export class UserAccountController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('account')
    @UseGuards(JwtAuthGuard)
    async getAccount(@UserDecorator() { email }: User) {
        return AuthUserDtoSchema.parse(await this.userService.findByEmailForAuth(email));
    }
}
