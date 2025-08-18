import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from '#/utils/logger';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { hasRole } from '#/utils/authority.utils';
import { Role } from 'runbotics-common';
import { UserService } from '../user/user.service';
import { MailService } from '#/mail/mail.service';
import { ScheduleProcess } from '#/scheduler-database/schedule-process/schedule-process.entity';
import { SchedulerService } from '#/queue/scheduler/scheduler.service';
import { User } from '#/scheduler-database/user/user.entity';

@Injectable()
export class TenantSubscriptionValidationService {
    private readonly logger = new Logger(TenantSubscriptionValidationService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly mailService: MailService,     private readonly scheduleProcessService: SchedulerService,
    ) {}
    
    private async checkTenantScheduledProcesses(tenantId: string, manager: EntityManager) {
        const processes = await manager.find(ScheduleProcess, {
            where: {
                user: {
                    tenantId,
                },
            },
        });
        
        if(processes.length > 0){ 
            for(const process of processes) {
                const newProcess = structuredClone(process);
                newProcess.active = false;
                await manager.save(ScheduleProcess, newProcess);
            }
        }
        
        const users = await manager.find(User, { where: { tenantId }  });
        for (const user of users) {
            const userJobProcesses = await this.scheduleProcessService.getScheduledJobs(user);
            for (const job of userJobProcesses) {
                await this.scheduleProcessService.deleteJobFromQueue(String(job.id), user);
            }
        }
        this.logger.log(`Deleted ${processes.length} scheduled processes for tenant ${tenantId}.`);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async validateTenants() {
        await this.dataSource.transaction(async manager => {
            const tenants = await manager.find(Tenant);

            for (const tenant of tenants) {
                if (!tenant.subscriptionEnd) continue;

                const now = dayjs();
                const endDate = dayjs(tenant.subscriptionEnd).endOf('day');
                const diffDays = endDate.diff(now, 'day');

                if (tenant.active && ([30, 14, 7].includes(diffDays) || diffDays <= 0)) {
                    await this.notifyUsersAboutExpiration(tenant, diffDays);
                }

                if (endDate.isBefore(now) && tenant.active) {
                    await this.checkTenantScheduledProcesses(tenant.id, manager);
                    await this.deactivateExpiredTenant(manager, tenant);
                }
            }
        });
    }

    private async notifyUsersAboutExpiration(tenant: Tenant, diffDays: number) {
        const users = await this.userService.findAllByTenantId(tenant.id);

        for (const user of users) {
            let recipients: string[] = [];
            let mailToLink = '';

            const isTenantAdmin = hasRole(user, Role.ROLE_TENANT_ADMIN);
            const isUser = hasRole(user, Role.ROLE_USER);

            if (isUser) {
                const tenantAdmins = await this.userService.findAllByTenantIdAndRole(tenant.id, Role.ROLE_TENANT_ADMIN);
                recipients = tenantAdmins.map(admin => admin.email);
                mailToLink = `mailto:${recipients.join(',')}`;
            } else if (isTenantAdmin) {
                const globalAdmins = await this.userService.findAllByRole(Role.ROLE_ADMIN);
                recipients = globalAdmins.map(admin => admin.email);
                mailToLink = `mailto:${recipients.join(',')}`;
            }

            await this.mailService.sendSubscriptionExpirationNotification(user, diffDays, mailToLink);
        }
    }

    private async deactivateExpiredTenant(manager: EntityManager, tenant: Tenant) {
        this.logger.warn(`Tenant with subscription end date ${tenant.subscriptionEnd} is expired.`);
        const updatedTenant: Tenant = {
            ...tenant,
            active: false,
        };
        await manager.save(Tenant, updatedTenant);
    }
}
