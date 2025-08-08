import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { DataSource } from 'typeorm';
import { Logger } from '#/utils/logger';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TenantSubscriptionValidationService {
    private readonly logger = new Logger(TenantSubscriptionValidationService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async validateTenants() {
        await this.dataSource.transaction(async manager => {
            const tenants = await manager.find(Tenant);

            for (const tenant of tenants) {
                if (tenant.subscriptionEnd) {
                    const now = new Date();
                    const endDate = new Date(tenant.subscriptionEnd);

                    if (endDate < now) {
                        this.logger.warn(`Tenant with subscription end date ${tenant.subscriptionEnd} is expired.`);
                        const updatedTenant: Tenant = {
                            ...tenant,
                            active: false,
                        };
                        await this.sendNotification(tenant, 'Your subscription has expired. Please renew to continue using the service.');
                        await manager.save(Tenant, updatedTenant);
                    }
                }
            }

        });
    }
    
    private async sendNotification(tenant: Tenant, message: string) {
        // TODO: Implement your notification logic here, e.g., send an email or log a message
        this.logger.log(`Notification for tenant ${tenant.id}: ${message}`);
    }
}
