import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { GetWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UserCriteria } from './criteria/user.criteria';
import { User } from './user.entity';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Tenant } from '../tenant/tenant.entity';


@Controller('/api/scheduler')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly userService: UserService
    ) { }

    @GetWithTenant('users/Page')
    getAllByPageInTenant(
        @Param('tenantId') tenantId: Tenant['id'],
        @Specifiable(UserCriteria) specs: Specs<User>,
        @Pageable() paging: Paging
    ) {
        this.logger.log('REST request to get all users by page');
        specs.where = { ...specs.where, tenantId };
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @Get('Page')
    getAllByPage() {}
}
