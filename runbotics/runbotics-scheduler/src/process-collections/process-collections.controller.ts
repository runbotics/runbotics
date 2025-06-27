import { Body, Controller, Request, Param, Post } from '@nestjs/common';
import { ProcessCollectionsService } from '#/process-collections/process-collections.service';
import { User } from '#/scheduler-database/user/user.entity';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { GrantPermissionRequest } from '#/process-collections/dto/grant-permission.dto';
import { AuthRequest } from '#/types';

@Controller('/api/scheduler/tenants/:tenantId/process-collections')
export class ProcessCollectionsController {

    constructor(private readonly processCollectionsService: ProcessCollectionsService) {
    }

    @Post('grant-permission')
    async grantPermission(
        @Param('tenandId') tenantId: string,
        @UserDecorator() user: User,
        @Body() data: GrantPermissionRequest,
        @Request() req: AuthRequest,
    ) {
        return this.processCollectionsService.grantPermission({
            tenantId,
            user,
            req,
            ...data,
        });
    }
}
