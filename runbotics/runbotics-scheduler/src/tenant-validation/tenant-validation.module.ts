import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '#/queue/queue.module';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';
import { TenantSubscriptionValidationService } from './tenant-subscription-validation.service';
import { UserModule } from '#/scheduler-database/user/user.module';
import { MailModule } from '#/mail/mail.module';

@Module({
    imports: [TypeOrmModule.forFeature(),
        QueueModule,
        TenantModule,
        UserModule,
        MailModule,
    ],
    providers: [TenantSubscriptionValidationService],
})
export class TenantValidationModule {
}
