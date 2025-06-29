import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { Logger } from '#/utils/logger';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { User } from '../user/user.entity';
import { LicenseService } from './license.service';
import { GetWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateLicenseDto, createLicenseSchema } from './dto/create-license.dto';
import { FeatureKey } from 'runbotics-common';
import { License } from './license.entity';
import { UpdateLicenseDto, updateLicenseSchema } from './dto/update-license.dto';

@Controller('/api/scheduler')
export class LicenseController {
    private readonly logger = new Logger(LicenseController.name);

    constructor(private readonly licenseService: LicenseService) {}

    @GetWithTenant('licenses/plugins/available')
    getAvailablePlugins(@UserDecorator() user: User) {
        return this.licenseService.getAvailablePlugins(user);
    }

    @GetWithTenant('licenses/:pluginName/info')
    getLicenseInfo(
        @UserDecorator() user: User,
        @Param('pluginName') pluginName: string
    ) {
        return this.licenseService.getLicenseInfo(user, pluginName);
    }

    // -------------- ENDPOINTS FOR ADMIN & ONE PUBLIC ------------------


    @Get('licenses/tenants/:tenantId')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    getAllLicensesByTenant(
        @Param('tenantId') tenantId: string
    ) {
        return this.licenseService.getAllLicensesByTenant(tenantId);
    }

    @Post('licenses')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    createLicense(
        @Body(new ZodValidationPipe(createLicenseSchema))
        licenseDto: CreateLicenseDto
    ) {
        return this.licenseService.create(licenseDto);
    }

    @Patch('licenses/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    updateLicense(
        @Param('id', ParseUUIDPipe) id: License['id'],
        @Body(new ZodValidationPipe(updateLicenseSchema))
        updateLicenseDto: UpdateLicenseDto
    ) {
        return this.licenseService.update(updateLicenseDto, id);
    }
}


