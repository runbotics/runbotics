import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '#/queue/queue.module';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';
import { TenantSubscriptionValidationService } from './tenant-subscription-validation.service';

@Module({
    imports: [TypeOrmModule.forFeature(),
    QueueModule,
        TenantModule,
    ],
    providers: [TenantSubscriptionValidationService],
})
export class TenantValidationModule {}
