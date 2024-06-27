import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantInviteCode } from './tenant-invite-code.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Tenant, TenantInviteCode])],
    providers: [TenantService],
    controllers: [TenantController],
    exports: [TenantService]
})
export class TenantModule {}
