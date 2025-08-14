import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '#/queue/queue.module';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';

@Module({
    imports: [TypeOrmModule.forFeature(),
    QueueModule,
        TenantModule,
    ]
})
export class TenantValidationModule {}
