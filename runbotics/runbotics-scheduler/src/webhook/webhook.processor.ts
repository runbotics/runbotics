import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueueService } from '#/queue/queue.service';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { Role, WebhookAuthorizationType } from 'runbotics-common';
import { inspect } from 'node:util';
import { WebhookIncomingEventLog } from '#/webhook/entities/webhook-incoming-event-log.entity';

@Processor('webhooks')
export class WebhooksProcessor {
    private readonly logger = new Logger(WebhooksProcessor.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly queueService: QueueService,
    ) {
    }

    private getValueByPath(obj: unknown, path: string): unknown {
        const parts = path.split('.');

        function recurse(current: any, index: number): unknown {
            const key = parts[index];

            if (current === null || current === undefined) {
                throw new Error(`Value not found: '${parts.slice(0, index).join('.')}' is undefined or null`);
            }

            let value: any;
            if (Array.isArray(current)) {
                const arrayIndex = Number(key);
                if (isNaN(arrayIndex)) {
                    throw new Error(`Expected an array index but got '${key}' at '${parts.slice(0, index).join('.')}'`);
                }
                if (arrayIndex < 0 || arrayIndex >= current.length) {
                    throw new Error(`Index '${arrayIndex}' is out of bounds at '${parts.slice(0, index).join('.')}'`);
                }
                value = current[arrayIndex];
            } else {
                if (!(key in current)) {
                    throw new Error(`Key '${key}' does not exist at '${parts.slice(0, index).join('.')}'`);
                }
                value = current[key];
            }

            if (index === parts.length - 1) {
                return value;
            }

            return recurse(value, index + 1);
        }

        return recurse(obj, 0);
    }

    @Process({ concurrency: 1 })
    async process(job: Job) {
        await this.dataSource.transaction(async (manager) => {
            const triggers = await manager.find(
                WebhookProcessTrigger,
                {
                    where: {
                        webhookId: job.data.webhookId as string,
                        tenantId: job.data.tenantId,
                    },
                    relations: {
                        process: true,
                        webhook: {
                            payload: true,
                        }
                    },
                },
            );
            const user = await manager.findOne(User, {
                where: {
                    authorities: {
                        name: Role.ROLE_SERVICE_ACCOUNT,
                    },
                    tenantId: job.data.tenantId,
                },
            });
            
            if (!user) {
                throw new NotFoundException('Service user does not exist');
            }

            for (const trigger of triggers) {
                try {
                    const variables = this.getValueByPath(job.data, trigger.webhook.payload.payloadDataPath) ?? {};

                    this.queueService.createInstantJob({
                        process: trigger.process,
                        triggerData: {
                            userEmail: user.email,
                        },
                        input: {
                            variables,
                        },
                        user,
                    });
                } catch (error) {
                    this.logger.error(error);
                }
            }
            await manager.save(WebhookIncomingEventLog, {
                status: 'success',
                payload: job.data,
                authorization: WebhookAuthorizationType.JWT,
            });
        }).catch(e => {
            this.dataSource.manager.save(WebhookIncomingEventLog, {
                status: 'failed',
                error: e,
                payload: job.data,
                authorization: WebhookAuthorizationType.JWT,
            });
            this.logger.error(e);
        });
    }

}
