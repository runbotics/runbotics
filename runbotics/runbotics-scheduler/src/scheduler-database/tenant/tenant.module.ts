import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantInviteCode } from './tenant-invite-code.entity';
import { EmailTriggerWhitelistItem } from '../email-trigger-whitelist-item/email-trigger-whitelist-item.entity';
import { LicenseModule } from '../license/license.module';

@Module({
    imports:[TypeOrmModule.forFeature([Tenant, TenantInviteCode, EmailTriggerWhitelistItem]), LicenseModule],
    providers: [TenantService],
    controllers: [TenantController],
    exports: [TenantService]
})
export class TenantModule {}
