import { Injectable } from '@nestjs/common';
import { IBot, IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';
import { ProcessInstanceService } from 'src/database/process-instance/process-instance.service';
import { Logger } from 'src/utils/logger';
import { ProcessInstanceEventService } from '#/database/process-instance-event/process-instance-event.service';
import { BotProcessEventService } from './process-launch/bot-process-instance-event.service';
import { BotProcessService } from './process-launch/bot-process-instance.service';

@Injectable()
export class BotLifecycleService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly botProcessEventService: BotProcessEventService,
        private readonly botProcessService: BotProcessService,
    ) { }
    
    private readonly logger = new Logger(BotLifecycleService.name);

    async handleProcessInstanceInterruption(bot: IBot): Promise<void> {
        const disconnectedBotProcessInstances = await this.processInstanceService.findAllByBotId(bot.id);
        disconnectedBotProcessInstances.forEach(async (processInstance) => {
            if (
                processInstance.status !== ProcessInstanceStatus.INITIALIZING &&
                processInstance.status !== ProcessInstanceStatus.IN_PROGRESS
            ) return;

            const newProcessInstance: IProcessInstance = {
                ...processInstance, 
                status: ProcessInstanceStatus.ERRORED, 
                error: 'Bot has been shut down'
            };

            await this.updateInterruptedProcessInstance(newProcessInstance, processInstance.id);            

            await this.handleProcessInstanceEventInterruption(processInstance, bot);
        });
    }

    private async handleProcessInstanceEventInterruption (processInstance: IProcessInstance, bot: IBot): Promise<void> {
        const activeEvents = await this.processInstanceEventService.findActiveByProcessInstanceId(processInstance.id);
        const processId: number = await this.processInstanceService.findById(processInstance.id).then(processInstance => processInstance.process.id);
        
        if(!activeEvents) return;
        
        activeEvents.forEach(async event => {

            const newProcessInstanceEvent: IProcessInstanceEvent = {
                ...event, 
                status: ProcessInstanceEventStatus.ERRORED, 
                error: 'Bot has been shut down',
                processInstance: {
                    id: processInstance.id,
                    process: {
                        id: processId
                    }
                }
            };
            
            await this.updateInterruptedProcessInstanceEvent(newProcessInstanceEvent, bot);
        });
    }

    private async updateInterruptedProcessInstance(processInstance: IProcessInstance, installationId: string) {
        this.logger.log(
            `<= Success process-instance (${
                processInstance.id
            }) has been updated after bot disconnection | status: ${
                processInstance.status
            }, error message: "${
                processInstance.error
            }"`
        );

        this.botProcessService.updateProcessInstance(installationId, processInstance)
        .then(() => {
            this.logger.log(
                `=> Updating process-instance (${
                    processInstance.id
                }) updated after bot disconnection | status: ${
                    processInstance.status
                }, error message: "${
                    processInstance.error
                }"`
            );
        }).catch(error => {
            this.logger.error(
                `=> Error updating process-instance (${
                    processInstance.id
                }): ${error}`,
            );
        });

    }

    private async updateInterruptedProcessInstanceEvent(processInstanceEvent: IProcessInstanceEvent, bot: IBot) {
        this.logger.log(
            `=> Updating process-instance (${
                processInstanceEvent.id
            }) updated after bot disconnection | status: ${
                processInstanceEvent.status
            }, error message: "${
                processInstanceEvent.error
            }"`
        );
        
        this.botProcessEventService.updateProcessInstanceEvent(processInstanceEvent, bot)
            .then(() => {
                this.logger.log(
                    `<= Success process-instance-event (${
                        processInstanceEvent.id
                    }) has been updated after bot disconnection | status: ${
                        processInstanceEvent.status
                    }, error message: "${
                        processInstanceEvent.error
                    }"`
                );
            }).catch(error => {
                this.logger.error(
                    `=> Error updating process-instance-event (${
                        processInstanceEvent.id
                    }): ${error}`,
                );
            });
    }
}
