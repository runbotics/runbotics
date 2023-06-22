import { Injectable } from '@nestjs/common';
import { DesktopTask, RuntimeService } from '#core/bpm/runtime';
import { RunboticsLogger } from '#logger';
import {
    BotWsMessage,
    IProcessInstance,
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    BpmnElementType,
    ProcessInstanceStep
} from 'runbotics-common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import { IActivityOwner } from '#core/bpm/bpmn.types';
import dayjs from 'dayjs';
import { LoopHandlerService } from '#core/bpm/loop-handler';

@Injectable()
export class RuntimeSubscriptionsService {
    constructor(
        private readonly runtimeService: RuntimeService,
        @InjectIoClientProvider() private readonly io: IoClient,
        private readonly loopHandlerService: LoopHandlerService
    ) {}

    private readonly logger = new RunboticsLogger(
        RuntimeSubscriptionsService.name
    );

    subscribeActivityEvents() {
        this.runtimeService.activityChange().subscribe(async (event) => {
            if (event.activity.content.type) {
                const desktopTask: DesktopTask = event.activity
                    .content as DesktopTask;
                let processInstanceEvent:
                    | IProcessInstanceEvent
                    | IProcessInstanceLoopEvent = {
                        created: dayjs().toISOString(),
                        processInstance: event.processInstance,
                        executionId: event.activity.executionId,
                        input: JSON.stringify({
                            ...desktopTask?.input,
                        }),
                        status: event.eventType,
                        error: event.activity.content.error?.description,
                        script: desktopTask.input?.script,
                    };

                try {
                    const eventBehavior = (
                        event.activity.owner as IActivityOwner
                    ).behaviour;
                    switch (event.activity.content.type) {
                        case BpmnElementType.ERROR_EVENT_DEFINITION:
                            processInstanceEvent.log = `ErrorEventDefinition: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = ProcessInstanceStep.ERROR_BOUNDARY;
                            break;
                        case BpmnElementType.BOUNDARY_EVENT:
                            // Boundary event doesn't carry any useful information. It's just a wrapper.
                            // Errors are handled in case: BpmnElementType.ERROR_EVENT_DEFINITION
                            return;
                        case BpmnElementType.SERVICE_TASK:
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${desktopTask.input?.script} ${event.eventType}`;
                            // eslint-disable-next-line no-case-declarations
                            const label = eventBehavior?.label;
                            // eslint-disable-next-line no-case-declarations
                            const script = desktopTask.input?.script;
                            if (eventBehavior?.label) {
                                processInstanceEvent.step = label;
                            } else {
                                processInstanceEvent.step = script;
                            }
                            break;
                        case  BpmnElementType.END_EVENT:
                            processInstanceEvent.step = ProcessInstanceStep.END;
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            break;
                        case  BpmnElementType.START_EVENT:
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = ProcessInstanceStep.START;
                            break;
                        case  BpmnElementType.EXCLUSIVE_GATEWAY:
                            processInstanceEvent.log = `Gateway: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = 'Gateway';
                            break;
                        case  BpmnElementType.SUBPROCESS:
                            // @ts-ignore
                            if (event.activity.content.isMultiInstance) {
                                // @ts-ignore
                                processInstanceEvent.log = `Loop: ${event.activity.content.type} ${event.activity.content.input?.script} ${event.eventType} `;
                            } else {
                                processInstanceEvent.log = `Loop: ${event.activity.content.type} ${event.eventType} `;
                            }

                            if (eventBehavior?.label) {
                                processInstanceEvent.step =
                                    eventBehavior?.label;
                            } else {
                                processInstanceEvent.step = 'Loop';
                            }
                            break;

                        default:
                            processInstanceEvent.log = `?? Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = 'Activity';
                            break;
                    }

                    if (
                        this.loopHandlerService.isLoopEvent(event.activity)
                    )
                        processInstanceEvent = {
                            ...processInstanceEvent,
                            iterationNumber: this.loopHandlerService.getIterationNumber(event.activity),
                            iteratorElement: this.loopHandlerService.getIteratorElement(event.activity, event.iteratorName),
                            loopId: this.loopHandlerService.getLoopId(event.activity),
                        };

                    switch (event.eventType) {
                        case ProcessInstanceEventStatus.COMPLETED:
                        case ProcessInstanceEventStatus.STOPPED:
                        case ProcessInstanceEventStatus.ERRORED:
                            processInstanceEvent.output = JSON.stringify({
                                ...desktopTask?.output,
                            });
                            processInstanceEvent.finished =
                                dayjs().toISOString();
                            break;
                    }

                    this.io.emit(
                        this.loopHandlerService.isLoopEvent(event.activity)
                            ? BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
                            : BotWsMessage.PROCESS_INSTANCE_EVENT,
                        processInstanceEvent
                    );
                } catch (e) {
                    this.logger.error(
                        'Error occurred while sending process instance',
                        e
                    );
                }
            }
        });
    }

    subscribeProcessEvents() {
        this.runtimeService.processChange().subscribe(async (event) => {
            const processInstance: IProcessInstance = {
                id: event.processInstanceId,
                orchestratorProcessInstanceId:
                    event.processInstance.orchestratorProcessInstanceId,
                // @ts-ignore
                status: event.eventType.toString(),
                updated: dayjs().toISOString(),
                process: {
                    id: Number(event.processInstance.process.id),
                },
                user: event.processInstance.user,
                rootProcessInstanceId:
                    event.processInstance.rootProcessInstanceId,
                trigger: event.processInstance.trigger,
                triggerData: event.processInstance.triggerData,
                error: event.processInstance.error,
            };
            switch (event.eventType) {
                case ProcessInstanceStatus.INITIALIZING:
                    processInstance.created = dayjs().toISOString();
                    break;
                case ProcessInstanceStatus.IN_PROGRESS:
                    try {
                        processInstance.input = JSON.stringify({
                            variables: event.processInstance.variables,
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
                            processInstance.output = JSON.stringify({
                                message: 'Exceeded max length',
                            });
                    }
                    break;
            }

            this.io.emit(BotWsMessage.PROCESS_INSTANCE, processInstance);
        });
    }
}
