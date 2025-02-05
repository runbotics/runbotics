import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantInviteCode } from './tenant-invite-code.entity';
import { EmailTriggerWhitelistItem } from '../emial-trigger-whitelist-item/emial-trigger-whitelist-item.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Tenant, TenantInviteCode, EmailTriggerWhitelistItem])],
    providers: [TenantService],
    controllers: [TenantController],
    exports: [TenantService]
})
export class TenantModule {}
