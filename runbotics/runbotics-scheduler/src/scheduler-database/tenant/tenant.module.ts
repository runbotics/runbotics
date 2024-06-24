import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Tenant])],
    providers: [TenantService],
    controllers: [TenantController],
    exports: [TenantService]
})
export class TenantModule {}
