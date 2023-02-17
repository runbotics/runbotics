import {
    forwardRef,
    Inject,
    Injectable,
    OnApplicationBootstrap,
    OnModuleDestroy,
} from '@nestjs/common';
import {
    BpmnEngine,
    BpmnEngineExecuteOptions,
    BpmnEngineExecutionApi,
    BpmnEngineExecutionDefinition,
    BpmnExecutionEventMessageApi,
    Engine,
} from 'bpmn-engine';
import {
    Expressions,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    RunboticModdleDescriptor,
    IProcessInstance,
    IProcess,
} from 'runbotics-common';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { mkdirSync, rmdirSync } from 'fs';

import { RunboticsLogger } from '#logger';

import { Camunda } from '../CamundaExtension';
import { customServices } from '../CustomServices';
import { DesktopRunnerService } from '../desktop-runner';
import { FieldResolver } from '../FieldResolver';
import { IActivityOwner, IEnvironment } from '../bpmn.types';
import {
    DesktopTask,
    IActivityEventData,
    IBpmnEngineEvent,
    IProcessEventData,
    IStartProcessInstance,
    RunBoticsExecutionEnvironment,
    BpmnProcessInstance,
} from './runtime.types';
import { BpmnEngineEventBus } from './bpmn-engine.event-bus';
import { LoopHandlerService } from '../loop-handler';

@Injectable()
export class RuntimeService implements OnApplicationBootstrap, OnModuleDestroy {
    engines: Record<string, BpmnEngine> = {};
    processInstances: Record<string, BpmnProcessInstance> = {};
    private readonly logger = new RunboticsLogger(RuntimeService.name);
    private readonly processEventBus =
        new BpmnEngineEventBus<IProcessEventData>();
    private readonly activityEventBus =
        new BpmnEngineEventBus<IActivityEventData>();

    constructor(
        @Inject(forwardRef(() => DesktopRunnerService))
        private desktopRunnerService: DesktopRunnerService,
        private readonly loopHandlerService: LoopHandlerService
    ) {}

    onApplicationBootstrap() {
        this.monitor();
    }

    onModuleDestroy() {
        for (const processInstance of Object.values(this.processInstances)) {
            this.logger.log(
                `Destroying running process instance ${processInstance.id}`
            );
            this.processEventBus.publish({
                processInstanceId: processInstance.id,
                eventType: ProcessInstanceStatus.ERRORED,
                processInstance: {
                    ...processInstance,
                    error: 'Bot has been shut down',
                },
            });
        }
    }

    processChange(): IBpmnEngineEvent<IProcessEventData> {
        return this.processEventBus.expose();
    }

    activityChange(): IBpmnEngineEvent<IActivityEventData> {
        return this.activityEventBus.expose();
    }

    private createTempDir() {
        mkdirSync(`${process.cwd()}/temp`, { recursive: true });
    }

    private cleanTempDir = async (processInstanceId: string): Promise<void> => {
        try {
            rmdirSync(`${process.cwd()}/temp`, { recursive: true });
            this.logger.log(
                `[${processInstanceId}] Deleted process instance temp directory`
            );
        } catch (error) {
            this.logger.log(
                `[${processInstanceId}] Process instance temp directory is clean`
            );
        }
    };

    private async monitor() {
        while (true) {
            const processInstancesLength = Object.keys(
                this.processInstances
            ).length;
            const enginesLength = Object.keys(this.engines).length;

            this.logger.warn(
                `Process instances: ${processInstancesLength} Engines: ${enginesLength}`
            );
            await new Promise((resolve) => setTimeout(resolve, 100000));
        }
    }

    public startProcessInstance = async (
        request: IStartProcessInstance
    ): Promise<string> => {
        const processInstanceId = uuidv4();

        const processInstance = {
            ...request,
            id: processInstanceId,
            status: ProcessInstanceStatus.INITIALIZING,
            ...(request.userId && { user: { id: request.userId } }),
            ...(request.trigger && { trigger: { name: request.trigger } }),
        };
        this.processInstances[processInstanceId] = processInstance;
        this.processEventBus.publish({
            processInstanceId,
            eventType: ProcessInstanceStatus.INITIALIZING,
            processInstance,
        });
        this.createTempDir();
        setTimeout(() => {
            this.createAndStartEngine(processInstance, request);
        }, 0);
        return processInstanceId;
    };

    private createAndStartEngine = async (
        processInstance: IProcessInstance,
        request: IStartProcessInstance
    ): Promise<void> => {
        const processInstanceId = processInstance.id;

        let engine = this.createEngine(processInstanceId, request.process);

        let listener = new EventEmitter();

        listener.on(
            'process.start',
            (execution: BpmnEngineExecutionDefinition) => {
                this.logger.log(
                    `[${processInstanceId}] [${execution.environment.options.name}] process.start`
                );
                const processInstance = {
                    ...this.processInstances[processInstanceId],
                    status: ProcessInstanceStatus.IN_PROGRESS,
                };
                this.processInstances[processInstanceId] = processInstance;
                this.processEventBus.publish({
                    processInstanceId: processInstance.id,
                    eventType: ProcessInstanceStatus.IN_PROGRESS,
                    processInstance,
                });
            }
        );

        listener.on('activity.start', (api: BpmnExecutionEventMessageApi) => {
            if ((api.environment as IEnvironment).runbotic?.disabled) return;

            if (this.loopHandlerService.shouldSkipElement(api)) return;

            if (this.loopHandlerService.getIteratorFromElement(api)) {
                this.loopHandlerService.setIteratorName(
                    api.executionId,
                    this.loopHandlerService.getIteratorFromElement(api)
                );
            }

            this.logger.log(`${getActivityLogPrefix(api)} activity.start`);

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.IN_PROGRESS,
                activity: api,
                iteratorName: this.loopHandlerService.getIteratorNameById(
                    api.content.parent.executionId
                ),
            });
        });

        listener.on('activity.end', (api: BpmnExecutionEventMessageApi) => {
            if ((api.environment as IEnvironment).runbotic?.disabled) return;

            this.logger.log(`${getActivityLogPrefix(api)} activity.end `);
            if (this.loopHandlerService.shouldSkipElement(api)) return;

            if (!this.processInstances[processInstance.id]) {
                this.activityEventBus.publish({
                    processInstance: {
                        ...processInstance,
                        status: ProcessInstanceStatus.TERMINATED,
                    },
                    eventType: ProcessInstanceEventStatus.TERMINATED,
                    activity: api,
                });
                return;
            }

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.COMPLETED,
                activity: api,
                iteratorName: this.loopHandlerService.getIteratorNameById(
                    api.environment.variables.content.parent.executionId
                ),
            });
        });

        listener.on('activity.stop', (api: BpmnExecutionEventMessageApi) => {
            this.logger.log(`${getActivityLogPrefix(api)} activity.stop`);

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.STOPPED,
                activity: api,
            });
        });

        listener.on('activity.error', (api: BpmnExecutionEventMessageApi) => {
            this.logger.error(`${getActivityLogPrefix(api)} activity.error`);

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.ERRORED,
                activity: api,
            });
        });

        // @ts-ignore
        engine.once('error', (error) => {
            try {
                this.logger.error(
                    `[${processInstanceId}] process.error`,
                    (error as Error)?.message
                );
                this.logger.error(
                    `[${processInstanceId}] Process errored error`,
                    error
                );
                this.logger.error(
                    `[${processInstanceId}] Process errored stack`,
                    (error as Error)?.stack
                );

                const processInstance = {
                    ...this.processInstances[processInstanceId],
                    status: ProcessInstanceStatus.ERRORED,
                };

                // TODO need to fine real output
                processInstance.output = error?.environment?.output;
                if (error?.definitions && error?.definitions?.length > 0) {
                    processInstance.variables =
                        error?.definitions[0]?.environment.variables;
                }
                this.processInstances[processInstanceId] = processInstance;

                this.processEventBus.publish({
                    processInstanceId,
                    eventType: ProcessInstanceStatus.ERRORED,
                    processInstance,
                });
            } finally {
                this.purgeEngine(processInstanceId);
                engine = null;
                listener = null;
            }
        });

        // @ts-ignore
        engine.once('stop', async (execution: BpmnEngineExecutionApi) => {
            try {
                const processInstance = {
                    ...this.processInstances[processInstanceId],
                    status: ProcessInstanceStatus.TERMINATED,
                };
                processInstance.variables =
                    execution.definitions[0]?.environment.variables;
                this.processInstances[processInstanceId] = processInstance;

                this.logger.log(
                    `[${processInstanceId}] [${execution.environment.options.name}] process.stop`
                );
                this.logger.log(`[${processInstanceId}] Process output`, {
                    ...execution.environment.output,
                });

                this.processEventBus.publish({
                    processInstanceId,
                    processInstance,
                    eventType: ProcessInstanceStatus.TERMINATED,
                });
            } finally {
                await this.purgeEngine(processInstanceId);
                engine = null;
                listener = null;
            }
        });

        // @ts-ignore
        engine.once('end', async (execution: BpmnEngineExecutionApi) => {
            try {
                const processInstance = {
                    ...this.processInstances[processInstanceId],
                    status: ProcessInstanceStatus.COMPLETED,
                };
                processInstance.variables =
                    execution.definitions[0]?.environment.variables;
                processInstance.output = execution.environment.output;
                this.processInstances[processInstanceId] = processInstance;

                setTimeout(() => {
                    this.processEventBus.publish({
                        processInstanceId: processInstance.id,
                        eventType: ProcessInstanceStatus.COMPLETED,
                        processInstance: { ...processInstance },
                    });
                }, 50);

                this.logger.log(
                    `[${processInstanceId}] [${execution.environment.options.name}] process.end`
                );
                this.logger.log(
                    `[${processInstanceId}] [${execution.environment.options.name}] Process output`,
                    {
                        ...execution.environment.output,
                    }
                );
                this.logger.log(
                    `[${processInstanceId}] [${execution.environment.options.name}] Process variables`,
                    {
                        ...execution.definitions[0].environment.variables,
                    }
                );
            } catch (e) {
                this.logger.error(`[${processInstanceId}] Error`, e);
            } finally {
                await this.purgeEngine(processInstanceId);
                engine = null;
                listener = null;
            }
        });

        const getActivityLogPrefix = (api: BpmnExecutionEventMessageApi) => {
            const activityType =
                (api.content as DesktopTask)?.input?.script ?? api.content.type;
            const activityLabel = (api.owner as IActivityOwner).behaviour.label;

            const baseLogPrefix = `[${processInstanceId}] [${api.executionId}] [${activityType}]`;

            return activityLabel
                ? `${baseLogPrefix} [${activityLabel}]`
                : baseLogPrefix;
        };

        const services = this.createEngineExecutionServices(processInstanceId);

        const engineExecutionOptions: BpmnEngineExecuteOptions = {
            services,
            variables: request.variables,
            listener,
        };

        await engine.execute(engineExecutionOptions);
    };

    private createEngine = (processInstanceId: string, process: IProcess) => {
        const Logger = (scope: any) => {
            return {
                debug: console.debug.bind(
                    console,
                    '[RuntimeService] bpmn-elements:' + scope
                ),
                error: console.error.bind(
                    console,
                    '[RuntimeService] bpmn-elements:' + scope
                ),
                warn: console.warn.bind(
                    console,
                    '[RuntimeService] bpmn-elements:' + scope
                ),
            };
        };

        const engine = Engine({
            name: process.name,
            source: process.definition,
            // Logger: Logger as any,
            extensions: {
                camunda: Camunda,
            },
            // elements: runboticsElements,
            moddleOptions: {
                camunda: RunboticModdleDescriptor,
            },
            expressions: {
                resolveExpression: Expressions.resolveExpression,
            },
        });

        this.engines[processInstanceId] = engine;
        return engine;
    };

    private purgeEngine = (processInstanceId: string) => {
        this.logger.log(`[${processInstanceId}] Cleaning engine`);
        delete this.engines[processInstanceId];
        const isSubProcess =
            this.processInstances[processInstanceId].rootProcessInstanceId;
        if (!isSubProcess) {
            this.cleanTempDir(processInstanceId);
            this.loopHandlerService.cleanUp();
        }

        setTimeout(() => {
            this.logger.log(`[${processInstanceId}] Cleaning instance`);
            delete this.processInstances[processInstanceId];
        }, 0);
    };

    private createEngineExecutionServices = (
        processInstanceId: string
    ): BpmnEngineExecuteOptions['services'] => ({
        ...customServices,
        desktop:
            (input: any) =>
                async (
                    executionContext: BpmnExecutionEventMessageApi,
                    callback: any
                ) => {
                    const desktopTask: DesktopTask = executionContext.content;
                    const script = desktopTask.input.script;
                    desktopTask.input = (await FieldResolver.resolveFields(
                        desktopTask.input
                    )) as DesktopTask['input'];
                    const executionId = input.content.executionId;
                    const runboticsExecutionEnvironment: RunBoticsExecutionEnvironment =
                    executionContext.environment;

                    if (runboticsExecutionEnvironment.runbotic?.disabled) {
                        this.logger.warn(
                            `[${processInstanceId}] [${executionId}] [${script}] Desktop script is skipped`
                        );
                        callback(null, { disabled: true });
                        return;
                    }

                    this.logger.log(
                        `[${processInstanceId}] [${executionId}] [${script}] Running desktop script`,
                        desktopTask.input
                    );

                    try {
                        const result = await this.desktopRunnerService.run({
                            script,
                            input: desktopTask.input,
                            processInstanceId,
                            rootProcessInstanceId:
                            this.processInstances[processInstanceId]
                                .rootProcessInstanceId,
                            userId: this.processInstances[processInstanceId].user
                                ?.id,
                            executionContext,
                            trigger: this.processInstances[processInstanceId]
                                .trigger.name as string,
                            triggeredBy:
                            this.processInstances[processInstanceId]
                                .triggeredBy,
                        });
                        this.logger.log(
                            `[${processInstanceId}] [${executionId}] [${script}] Desktop action executed successfully`,
                            result
                        );

                        callback(null, result);
                    } catch (e) {
                        this.logger.error(
                            `[${processInstanceId}] [${executionId}] [${script}] Error running desktop action`,
                            (e as Error)?.message
                        );
                        callback(new Error((e as Error)?.message));
                    }
                },
    });

    public terminateProcessInstance = async (
        processInstanceId: string
    ): Promise<void> => {
        if (
            !this.engines[processInstanceId] ||
            !this.processInstances[processInstanceId]
        ) {
            this.logger.warn(
                `[${processInstanceId}] Process instance is not running`
            );
            return Promise.reject();
        }

        for (const instanceId in this.processInstances) {
            this.logger.log(`[${instanceId}] Terminating process instance`);
            this.engines[instanceId].stop();
            this.purgeEngine(instanceId);
        }
        return Promise.resolve();
    };

    public async assignVariables(processInstanceId: string, vars: any) {
        // assign to global scope
        const definitions = await this.engines[
            processInstanceId
        ].getDefinitions();
        const definition = definitions[0];
        const globalVariables = {
            ...definition.environment.variables,
            ...vars,
        };
        // globalVariables[input.variable] = input.value;
        definition.environment.assignVariables(globalVariables);
    }
}
