import { Injectable } from '@nestjs/common';
import { DesktopTask, RuntimeService } from '../../bpm/Runtime';
import { RunboticsLogger } from '../../../logger/RunboticsLogger';
import {
    BotWsMessage, IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus, ProcessInstanceStatus,
} from 'runbotics-common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import { IActivityOwner } from 'src/core/bpm/bpmn.types';
import dayjs from 'dayjs';

@Injectable()
export class RuntimeSubscriptionsService {
    constructor(
        private readonly runtimeService: RuntimeService,
        @InjectIoClientProvider() private readonly io: IoClient,
    ) {}

    private readonly logger = new RunboticsLogger(RuntimeSubscriptionsService.name);

    subscribeActivityEvents() {
        this.runtimeService.activityChange().subscribe(async (event) => {
            if (event.activity.content.type) {
                const desktopTask: DesktopTask = event.activity.content as DesktopTask;
                const processInstanceEvent: IProcessInstanceEvent = {
                    created: dayjs().toISOString(),
                    processInstance: event.processInstance,
                    executionId: event.activity.executionId,
                    input: JSON.stringify({
                        ...desktopTask?.input,
                    }),
                    status: event.eventType,
                    // @ts-ignore
                    error: event.activity.content.error?.description,
                };

                try {
                    switch (event.activity.content.type) {
                        case 'bpmn:ServiceTask':
                            const eventBehaviour = (event.activity.owner as IActivityOwner).behaviour;
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${desktopTask.input?.script} ${event.eventType}`;
                            switch (desktopTask.input?.script) {
                                case 'general.startProcess':
                                    processInstanceEvent.step = `${eventBehaviour.label}: ${desktopTask.input?.processName}`;
                                    break;
                                default:
                                    const label = eventBehaviour?.label;
                                    // xml field 'runbotics' is a temporary solution.
                                    const translateKey = eventBehaviour?.runbotics;
                                    
                                    if(eventBehaviour?.label) {
                                        processInstanceEvent.step = label;
                                    } else if (translateKey) {
                                        processInstanceEvent.step = translateKey;
                                    } else {
                                        processInstanceEvent.step = desktopTask.input?.script
                                    }
                            }
                            break;
                        case 'bpmn:EndEvent':
                            processInstanceEvent.step = `Process.List.Table.Step.EndEvent`;
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            break;
                        case 'bpmn:StartEvent':
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = `Process.List.Table.Step.StartEvent`;
                            break;
                        case 'bpmn:ExclusiveGateway':
                            processInstanceEvent.log = `Gateway: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = `Gateway`;
                            break;
                        case 'bpmn:SubProcess':
                            // @ts-ignore
                            if (event.activity.content.isMultiInstance) {
                                // @ts-ignore
                                processInstanceEvent.log = `SubProcess: ${event.activity.content.type}  ${event.activity.content.input?.script} ${event.eventType} `;
                            } else {
                                processInstanceEvent.log = `SubProcess: ${event.activity.content.type} ${event.eventType} `;
                            }
                            processInstanceEvent.step = `SubProcess`;
                            break;
                        default:
                            processInstanceEvent.log = `?? Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = `Activity`;
                            break;
                    }

                    switch (event.eventType) {
                        case ProcessInstanceEventStatus.COMPLETED:
                        case ProcessInstanceEventStatus.STOPPED:
                        case ProcessInstanceEventStatus.ERRORED:
                            processInstanceEvent.output = JSON.stringify({
                                ...desktopTask?.output,
                            });
                            processInstanceEvent.finished = dayjs().toISOString();
                            break;
                    }

                    // DevConsole.log('Sending process change to server', event, 'WebsocketService');

                    this.io.emit(BotWsMessage.PROCESS_INSTANCE_EVENT, processInstanceEvent);
                } catch (e) {
                    this.logger.error('Error occurred while sending process instance', e);
                }
            }
        });
    }

    subscribeProcessEvents() {
        this.runtimeService.processChange().subscribe(async (event) => {
            const processInstance: IProcessInstance = {
                id: event.processInstanceId,
                orchestratorProcessInstanceId: event.processInstance.orchestratorProcessInstanceId,
                // @ts-ignore
                status: event.eventType.toString(),
                updated: dayjs().toISOString(),
                process: {
                    id: Number(event.processInstance.process.id),
                },
                user: { id: event.processInstance.user.id },
                rootProcessInstanceId: event.processInstance.rootProcessInstanceId,
                scheduled: event.processInstance.scheduled,
            };
            switch (event.eventType) {
                case ProcessInstanceStatus.INITIALIZING:
                    processInstance.created = dayjs().toISOString();
                    break;
                case ProcessInstanceStatus.IN_PROGRESS:
                    try {
                        processInstance.input = JSON.stringify({
                            ...event.processInstance.params,
                        });
                    } catch (e) {
                        this.logger.error('Error preparing input');
                        processInstance.input = JSON.stringify({
                            result: 'Error preparing input',
                        });
                    }
                    break;
                case ProcessInstanceStatus.COMPLETED:
                case ProcessInstanceStatus.STOPPED:
                case ProcessInstanceStatus.ERRORED:
                    let variables = {};
                    try {
                        variables = { ...event.processInstance.variables };
                        delete variables['fields'];
                        delete variables['content'];
                        delete variables['properties'];
                    } catch (e) {
                        this.logger.error('Error from process.');
                    }
                    try {
                        processInstance.input = JSON.stringify({
                            ...event.processInstance.params,
                        });
                    } catch (e) {
                        this.logger.error('Error preparing input');
                        processInstance.input = JSON.stringify({
                            result: 'Error preparing input',
                        });
                    }

                    try {
                        processInstance.output = JSON.stringify({
                            output: event.processInstance.output,
                            variables: variables,
                        });
                    } catch (e) {
                        this.logger.error('Error preparing output');
                        processInstance.output = JSON.stringify({
                            result: 'Error preparing output',
                        });
                    } finally {
                        if (processInstance.output.length > 10000)
                            processInstance.output = JSON.stringify({ message: 'Exceeded max length' });
                    }
                    break;
            }

            this.io.emit(BotWsMessage.PROCESS_INSTANCE, processInstance);
        });
    }
}
