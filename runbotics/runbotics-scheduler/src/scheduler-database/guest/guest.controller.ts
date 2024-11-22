import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Controller, Get, NotFoundException, UseInterceptors } from '@nestjs/common';
import { GuestService } from './guest.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '../user/user.entity';
import { Logger } from '#/utils/logger';


@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/guests')
export class GuestController {
    private readonly logger = new Logger(GuestController.name);

    constructor(
        private readonly guestService: GuestService,
    ) {}

    @Get('user')
    async getGuestByUser(
        @UserDecorator() user: User,
    ) {
        const guest = await this.guestService.findByUserId(user.id);

        if (!guest) {
            this.logger.error('Cannot find guest based on user id: ', user.id);
            throw new NotFoundException();
        }

        return guest;
    }

}