import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantInviteCode } from './tenant-invite-code.entity';
import { EmailTriggerWhitelistItem } from '../email-trigger-whitelist-item/email-trigger-whitelist-item.entity';
import { LicenseModule } from '../license/license.module';
import { TenantRoleAdminController } from './tenantRoleAdmin.controller';
import { TenantPublicController } from './tenantPublic.controller';
import { TenantSubscriptionValidationService } from './tenant-subscription-validation.service';
import { MailModule } from '#/mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Tenant, TenantInviteCode, EmailTriggerWhitelistItem]), 
        LicenseModule, 
        MailModule, 
        forwardRef(() => UserModule),
    ],
    providers: [
        TenantService, 
        TenantSubscriptionValidationService
    ],
    controllers: [
        TenantController, 
        TenantRoleAdminController, 
        TenantPublicController
    ],
    exports: [TenantService]
})
export class TenantModule {
}
