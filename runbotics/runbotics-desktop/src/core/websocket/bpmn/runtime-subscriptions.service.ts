import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BpmnExecutionEventMessageExtendedApi, DesktopTask, RuntimeService } from '#core/bpm/runtime';
import { RunboticsLogger } from '#logger';
import {
    BotWsMessage,
    IProcessInstance,
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    BpmnElementType,
    ProcessInstanceStep,
} from 'runbotics-common';
import { ActivityOwner, Behaviour } from '#core/bpm/bpmn.types';
import dayjs from 'dayjs';
import { LoopHandlerService } from '#core/bpm/loop-handler';
import { Message } from '../queue/message-queue.service';
import { WebsocketService } from '../websocket.service';
import { StorageService } from '#config';
import { truncateStructure } from '#utils/structureTruncator';

const MAX_STRUCTURE_SIZE = 100_000;

@Injectable()
export class RuntimeSubscriptionsService {
    constructor(
        @Inject(forwardRef(() => WebsocketService))
        private readonly websocketService: WebsocketService,
        private readonly runtimeService: RuntimeService,
        private readonly loopHandlerService: LoopHandlerService,
        private readonly storageService: StorageService,
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
                        input: this.sanitizeStructure({ ...desktopTask?.input }),
                        status: event.eventType,
                        error: event.activity.content.error?.description,
                        script: desktopTask.input?.script,
                    };

                try {
                    const eventBehavior = (
                        event.activity.owner as ActivityOwner
                    ).behaviour;
                    switch (event.activity.content.type) {
                        case BpmnElementType.ERROR_EVENT_DEFINITION: {
                            const variables = {};
                            variables['caughtErrorMessage'] = desktopTask.output.description;
                            const setVariables = { ...event.activity.environment.variables, ...variables };
                            event.activity.environment.assignVariables(setVariables);
                            processInstanceEvent.log = `ErrorEventDefinition: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = ProcessInstanceStep.ERROR_BOUNDARY;
                            break;
                        }
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
                        case BpmnElementType.END_EVENT:
                            processInstanceEvent.step = ProcessInstanceStep.END;
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            break;
                        case BpmnElementType.START_EVENT:
                            processInstanceEvent.log = `Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step =
                                ProcessInstanceStep.START;
                            break;
                        case BpmnElementType.SEQUENCE_FLOW:
                            // eslint-disable-next-line no-case-declarations
                            const gatewayName = this.storageService.getValue(desktopTask.sourceId);
                            processInstanceEvent.log = `SequenceFlow (after Gateway): ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = `${gatewayName}: ${desktopTask.name ?? desktopTask.id}`;
                            processInstanceEvent.executionId = event.activity.content.sequenceId;
                            this.storageService.removeValue(desktopTask.sourceId);
                            break;
                        case BpmnElementType.SUBPROCESS:
                            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            if (event.activity.content.isMultiInstance) {
                                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                processInstanceEvent.log = `Loop: ${event.activity.content.type} ${event.activity.content.input?.script} ${event.eventType} `;
                            } else {
                                processInstanceEvent.log = `Loop: ${event.activity.content.type} ${event.eventType} `;
                            }

                            if (eventBehavior?.label) {
                                processInstanceEvent.step = eventBehavior?.label;
                            } else {
                                processInstanceEvent.step = 'Loop';
                            }
                            break;

                        case BpmnElementType.EXCLUSIVE_GATEWAY:
                            // eslint-disable-next-line no-case-declarations
                            const sequencesWithoutExpression = this.runtimeService.getSequencesWithoutExpression(event.activity.owner as ActivityOwner);
                            // eslint-disable-next-line no-case-declarations
                            const activityName = event.activity.name ?? event.activity.id;
                            if (sequencesWithoutExpression.length > 0) {
                                processInstanceEvent.step = activityName;
                                processInstanceEvent.error = 'Empty condition in sequence flows: ' + sequencesWithoutExpression.join(', ');
                            } else {
                                const errorDescription = event.activity.content.error.description
                                    .split(' ')
                                    .slice(1)
                                    .join(' ');
                                processInstanceEvent.step = activityName;
                                processInstanceEvent.error = activityName
                                    ? `${activityName}: ${errorDescription}`
                                    : event.activity.content.error.description;
                            }
                            break;

                        default:
                            processInstanceEvent.log = `?? Activity: ${event.activity.content.type} ${event.eventType}`;
                            processInstanceEvent.step = 'Activity';
                            break;
                    }

                    if (this.loopHandlerService.isLoopEvent(event.activity))
                        processInstanceEvent = {
                            ...processInstanceEvent,
                            iterationNumber:
                                this.loopHandlerService.getIterationNumber(
                                    event.activity
                                ),
                            iteratorElement:
                                this.loopHandlerService.getIteratorElement(
                                    event.activity,
                                    event.iteratorName
                                ),
                            loopId: this.loopHandlerService.getLoopId(
                                event.activity
                            ),
                        };

                    switch (event.eventType) {
                        case ProcessInstanceEventStatus.COMPLETED:
                        case ProcessInstanceEventStatus.STOPPED:
                        case ProcessInstanceEventStatus.ERRORED:
                            if (!this.isLoopSubprocess(event.activity, eventBehavior)) {
                                processInstanceEvent.output = this.sanitizeStructure({ ...desktopTask?.output });
                            }
                            processInstanceEvent.finished =
                                dayjs().toISOString();
                            break;
                    }

                    const processInstanceEventType =
                        this.loopHandlerService.isLoopEvent(event.activity)
                            ? BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
                            : BotWsMessage.PROCESS_INSTANCE_EVENT;

                    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    const message: Message = {
                        event: processInstanceEventType,
                        payload: processInstanceEvent,
                    };

                    this.websocketService.emitMessage(message);
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
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                status: event.eventType.toString(),
                updated: dayjs().toISOString(),
                created: event.processInstance.created,
                process: {
                    id: Number(event.processInstance.process.id),
                    name: event.processInstance.process.name,
                },
                user: event.processInstance.user,
                rootProcessInstanceId:
                    event.processInstance.rootProcessInstanceId,
                trigger: event.processInstance.trigger,
                triggerData: event.processInstance.triggerData,
                error: event.processInstance.error,
                callbackUrl: event.processInstance.callbackUrl,
                parentProcessInstanceId: event.processInstance.parentProcessInstanceId,
            };
            switch (event.eventType) {
                case ProcessInstanceStatus.INITIALIZING:
                    processInstance.created = processInstance.created ?? dayjs().toISOString();
                    break;
                case ProcessInstanceStatus.IN_PROGRESS:
                    try {
                        processInstance.input = this.sanitizeStructure(
                            { variables: event.processInstance.variables }
                        );
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
                    //eslint-disable-next-line no-case-declarations
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
                        processInstance.output = this.sanitizeStructure({
                            processOutput: event.processInstance?.processOutput ?? {},
                            variables,
                        });
                    } catch (e) {
                        this.logger.error('Error preparing output');
                        processInstance.output = JSON.stringify({
                            result: 'Error preparing output',
                        });
                    }

                    break;
            }

            const message: Message = {
                event: BotWsMessage.PROCESS_INSTANCE,
                payload: processInstance,
            };

            this.websocketService.emitMessage(message);
        });
    }

    private sanitizeStructure(variable: object): string {
        const variableToCheck: string = JSON.stringify(variable);
        if (variableToCheck && variableToCheck.length > MAX_STRUCTURE_SIZE)
            return JSON.stringify({
                message: 'Exceeded max length. Result is truncated.',
                partialResponse: truncateStructure({ originalObject: variable, maxSize: MAX_STRUCTURE_SIZE })
            });
        return variableToCheck;
    }

    private isLoopSubprocess(activity: BpmnExecutionEventMessageExtendedApi, eventBehavior: Behaviour): boolean {
        return BpmnElementType.SUBPROCESS === activity.content.type && eventBehavior.actionId === 'loop.loop';
    }
}
