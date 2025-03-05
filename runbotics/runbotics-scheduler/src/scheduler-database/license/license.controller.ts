import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { User } from '../user/user.entity';
import { LicenseService } from './license.service';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/licenses')
export class LicenseController {
    private readonly logger = new Logger(LicenseController.name);

    constructor(private readonly licenseService: LicenseService) {}

    @Get('plugins/available')
    getAvailablePlugins(@UserDecorator() user: User) {
        this.logger.log(
            `REST request to get all plugins with a valid license for the the tenant ${user.tenantId}`
        );
        return this.licenseService.getAvailablePlugins(user);
    }

    @Get('license/:pluginName/info')
    getLicenseInfo(
        @UserDecorator() user: User,
        @Param('pluginName') pluginName: string
    ) {
        this.logger.log(
            `REST request to get license info for the the tenant ${user.tenantId} and plugin ${pluginName}`
        );
        return this.licenseService.getLicenseInfo(user, pluginName);
    }
}
