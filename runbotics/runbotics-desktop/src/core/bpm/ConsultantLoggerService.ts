import { Injectable } from '@nestjs/common';
import { RuntimeService } from './Runtime';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import { ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';

@Injectable()
export class ConsultantLoggerService {
    private readonly logger = new RunboticsLogger(RuntimeService.name);

    constructor(private runtimeService: RuntimeService) {
        runtimeService.activityChange().subscribe((event) => {
            switch (event.activity.content.type) {
                case 'bpmn:StartEvent':
                    if (event.eventType == ProcessInstanceEventStatus.COMPLETED) {
                        this.logger.log(`Process started`, event, 'ConsultantLoggerService');
                    }
                    break;
                case 'bpmn:ServiceTask':
                    this.logger.log(
                        // @ts-ignore
                        `ServiceTask: ${event.activity.type}:${event.activity.content.input.script} ${event.eventType}`,
                        event,
                        'ConsultantLoggerService',
                    );
                    break;
                case 'bpmn:ErrorEventDefinition':
                    this.logger.log(`ErrorEventDefinition`, 'ConsultantLoggerService');
                    break;
                case 'bpmn:ManualTask':
                    this.logger.log(
                        // @ts-ignore
                        `ManualTask: ${event.activity.content.input.component} ${event.eventType}`,
                        event,
                        'ConsultantLoggerService',
                    );
                    break;
                case 'bpmn:EndEvent':
                    // if (event.eventType == IActivityEventDataStatus.COMPLETED) {
                    //     DevConsole.log(`Process completed`, event, 'ConsultantLoggerService');
                    // }
                    break;
                default:
                    this.logger.log(
                        `Activity: ${event.activity.type} ${event.eventType}`,
                        event,
                        'ConsultantLoggerService',
                    );
            }
        });

        this.runtimeService.processChange().subscribe((event) => {
            this.logger.log(`Process `, event.eventType, 'ConsultantLoggerService');

            switch (event.eventType) {
                case ProcessInstanceStatus.COMPLETED:
                case ProcessInstanceStatus.STOPPED:
                    this.logger.log(`Process output `, 'ConsultantLoggerService');
                    break;
                default:
                    break;
            }
        });
    }
}
