import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueueService } from '#/queue/queue.service';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { Role } from 'runbotics-common';
import { inspect } from 'node:util';

@Processor('webhooks')
export class WebhooksProcessor  {
    private readonly logger = new Logger(WebhooksProcessor.name);
    
    constructor(
        private readonly dataSource:DataSource,
        private readonly queueService: QueueService,
    ) {}

    @Process({concurrency: 1})
    async process(job: Job) {
        this.logger.log(`Przetwarzanie webhooka: ${job.id} [${inspect(job.data, {depth: 4})}]`);
        
        const transaction = await this.dataSource.transaction(async (manager) => {
            const triggers = await manager.find(WebhookProcessTrigger, 
                { 
                    where: {
                        webhookId: job.data.webhookId as string
                    },
                    relations: {
                        process: true,
                    }
            });
            const user = await manager.findOne(User, {
                where: {
                    authorities: {
                        name: Role.ROLE_SERVICE_ACCOUNT,
                    },
                    tenantId: job.data.tenantId,
                }
            });
            console.log(user);
            if(!user) {
                throw new NotFoundException('Service user does not exist');
            }

            for (const trigger of triggers) {
                this.logger.log(`Triggering process ${trigger.processId}`);
                await this.queueService.createInstantJob({
                    process: trigger.process,
                    triggerData: {
                        userEmail: user.email,
                    },
                    input: {
                        variables: job.data ?? {},
                    },
                    user
                });
            }
        });
    }
    
}
