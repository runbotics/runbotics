import { forwardRef, Inject, Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
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
import { Camunda } from '../CamundaExtension';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { customServices } from '../CustomServices';
import { DesktopRunnerService } from '../../../DesktopRunnerService';
import { RunboticsLogger } from '../../../logger/RunboticsLogger';
import { FieldResolver } from '../FieldResolver';
import { IActivityOwner, IEnviroment } from '../bpmn.types';
import {
    DesktopTask, IActivityEventData, IBpmnEngineEvent, IProcessEventData, IStartProcessInstance,
    RunBoticsExecutionEnvironment, BpmnProcessInstance,
} from './Runtime.types';
import { BpmnEngineEvent } from './BpmnEngineEvent';
import { mkdirSync, rmdirSync } from 'fs';

@Injectable()
export class RuntimeService implements OnApplicationBootstrap, OnModuleDestroy {
    engines: Record<string, BpmnEngine> = {};
    processInstances: Record<string, BpmnProcessInstance> = {};
    private readonly logger = new RunboticsLogger(RuntimeService.name);
    private readonly onProcessChange = new BpmnEngineEvent<IProcessEventData>();
    private readonly onActivityChange = new BpmnEngineEvent<IActivityEventData>();

    constructor(@Inject(forwardRef(() => DesktopRunnerService)) private desktopRunnerService: DesktopRunnerService) { }

    onApplicationBootstrap() {
        this.monitor().then();
    }

    onModuleDestroy() {
        for (const processInstance of Object.values(this.processInstances)) {
            this.logger.log(`Destroying running process instance ${processInstance.id}`);
            this.onProcessChange.publish({
                processInstanceId: processInstance.id,
                eventType: ProcessInstanceStatus.ERRORED,
                processInstance: { ...processInstance, error: 'Bot has been shut down' },
            });
        }
    }

    processChange(): IBpmnEngineEvent<IProcessEventData> {
        return this.onProcessChange.expose();
    }

    activityChange(): IBpmnEngineEvent<IActivityEventData> {
        return this.onActivityChange.expose();
    }

    private createTempDir() {
        mkdirSync(`${process.cwd()}/temp`, { recursive: true });
    }

    private cleanTempDir = async (processInstanceId: string): Promise<void> => {
        try {
            rmdirSync(`${process.cwd()}/temp`, { recursive: true });
            this.logger.log(`[${processInstanceId}] Deleted process instance temp directory`);
        } catch (error) {
            this.logger.log(`[${processInstanceId}] Process instance temp directory is clean`);
        }
    }

    private async monitor() {
        while (true) {
            const processInstancesLength = Object.keys(this.processInstances).length;
            const enginesLength = Object.keys(this.engines).length;

            this.logger.warn(`Process instances: ${processInstancesLength} Engines: ${enginesLength}`);
            await new Promise((resolve) => setTimeout(resolve, 100000));
        }
    }

    public startProcessInstance = async (request: IStartProcessInstance): Promise<string> => {
        const processInstanceId = uuidv4();

        const processInstance = {
            id: processInstanceId,
            process: request.process,
            params: request.params,
            status: ProcessInstanceStatus.INITIALIZING,
            user: { id: request.userId },
            orchestratorProcessInstanceId: request.orchestratorProcessInstanceId,
            variables: request.params.variables,
            rootProcessInstanceId: request.rootProcessInstanceId,
            scheduled: request.scheduled,
        };
        this.processInstances[processInstanceId] = processInstance;
        this.onProcessChange.publish({
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
        request: IStartProcessInstance,
    ): Promise<void> => {
        const processInstanceId = processInstance.id;

        let engine = this.createEngine(processInstanceId, request.process);

        let listener = new EventEmitter();

        listener.on('process.start', (execution: BpmnEngineExecutionDefinition) => {
            this.logger.log(`[${processInstanceId}] [${execution.environment.options.name}] process.start`);
            const processInstance = {
                ...this.processInstances[processInstanceId],
                status: ProcessInstanceStatus.IN_PROGRESS,
            };
            this.processInstances[processInstanceId] = processInstance;
            this.onProcessChange.publish({
                processInstanceId: processInstance.id,
                eventType: ProcessInstanceStatus.IN_PROGRESS,
                processInstance,
            });
        });

        listener.on('activity.start', (api: BpmnExecutionEventMessageApi) => {
            if ((api.environment as IEnviroment).runbotic?.disabled
                || api.content.parent?.type === 'bpmn:SubProcess')
                return;
            this.logger.log(`${getActivityLogPrefix(api)} activity.start`);

            this.onActivityChange.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.IN_PROGRESS,
                activity: api,
            });
        });

        listener.on('activity.end', (api: BpmnExecutionEventMessageApi) => {
            if ((api.environment as IEnviroment).runbotic?.disabled
                || api.content.parent?.type === 'bpmn:SubProcess')
                return;

            this.logger.log(`${getActivityLogPrefix(api)} activity.end`);

            if (!this.processInstances[processInstance.id]) {
                this.onActivityChange.publish({
                    processInstance: {
                        ...processInstance,
                        status: ProcessInstanceStatus.TERMINATED,
                    },
                    eventType: ProcessInstanceEventStatus.TERMINATED,
                    activity: api,
                });
                return;
            }


            this.onActivityChange.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.COMPLETED,
                activity: api,
            });
        });

        listener.on('activity.stop', (api: BpmnExecutionEventMessageApi) => {
            this.logger.log(`${getActivityLogPrefix(api)} activity.stop`);

            this.onActivityChange.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.STOPPED,
                activity: api,
            });
        });

        listener.on('activity.error', (api: BpmnExecutionEventMessageApi) => {
            this.logger.error(`${getActivityLogPrefix(api)} activity.error`);

            this.onActivityChange.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.ERRORED,
                activity: api,
            });
        });

        // @ts-ignore
        engine.once('error', (error) => {
            try {
                this.logger.error(`[${processInstanceId}] process.error`, (error as Error)?.message);
                this.logger.error(`[${processInstanceId}] Process errored error`, error);
                this.logger.error(`[${processInstanceId}] Process errored stack`, (error as Error)?.stack);

                const processInstance = {
                    ...this.processInstances[processInstanceId],
                    status: ProcessInstanceStatus.ERRORED,
                };

                // TODO need to fine real output
                processInstance.output = error?.environment?.output;
                if (error?.definitions && error?.definitions?.length > 0) {
                    processInstance.variables = error?.definitions[0]?.environment.variables;
                }
                this.processInstances[processInstanceId] = processInstance;

                this.onProcessChange.publish({
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
                processInstance.variables = execution.definitions[0]?.environment.variables;
                this.processInstances[processInstanceId] = processInstance;

                this.logger.log(`[${processInstanceId}] [${execution.environment.options.name}] process.stop`);
                this.logger.log(`[${processInstanceId}] Process output`, { ...execution.environment.output });

                this.onProcessChange.publish({
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
                processInstance.variables = execution.definitions[0]?.environment.variables;
                processInstance.output = execution.environment.output;
                this.processInstances[processInstanceId] = processInstance;

                setTimeout(() => {
                    this.onProcessChange.publish({
                        processInstanceId: processInstance.id,
                        eventType: ProcessInstanceStatus.COMPLETED,
                        processInstance: { ...processInstance },
                    });
                }, 50);

                this.logger.log(`[${processInstanceId}] [${execution.environment.options.name}] process.end`);
                this.logger.log(`[${processInstanceId}] [${execution.environment.options.name}] Process output`, { ...execution.environment.output });
                this.logger.log(`[${processInstanceId}] [${execution.environment.options.name}] Process variables`, {
                    ...execution.definitions[0].environment.variables,
                });
            } catch (e) {
                this.logger.error(`[${processInstanceId}] Error`, e);
            } finally {
                await this.purgeEngine(processInstanceId);
                engine = null;
                listener = null;
            }
        });

        const getActivityLogPrefix = (api: BpmnExecutionEventMessageApi) => {
            const activityType = (api.content as DesktopTask)?.input?.script ?? api.content.type;
            const activityLabel = (api.owner as IActivityOwner).behaviour.label;

            const baseLogPrefix = `[${processInstanceId}] [${api.executionId}] [${activityType}]`;

            return activityLabel ? `${baseLogPrefix} [${activityLabel}]` : baseLogPrefix;
        };

        const services = this.createEngineExecutionServices(processInstanceId);

        const engineExecutionOptions: BpmnEngineExecuteOptions = {
            services,
            variables: request.params.variables,
            listener,
        };

        await engine.execute(engineExecutionOptions);
    };

    private createEngine = (processInstanceId: string, process: IProcess) => {
        const Logger = (scope: any) => {
            return {
                debug: console.debug.bind(console, '[RuntimeService] bpmn-elements:' + scope),
                error: console.error.bind(console, '[RuntimeService] bpmn-elements:' + scope),
                warn: console.warn.bind(console, '[RuntimeService] bpmn-elements:' + scope),
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
    }

    private purgeEngine = (processInstanceId: string) => {
        this.logger.log(`[${processInstanceId}] Cleaning engine`);

        // this.engines[processInstanceId].stop()
        // this.engines[processInstanceId].broker.reset();
        // const definitions = await this.engines[processInstanceId].getDefinitions();
        // for(let definition of definitions){
        //     // definition.stop();
        //     definition.broker.reset();
        // }
        // listener.removeAllListeners();
        delete this.engines[processInstanceId]
        const isSubProcess = this.processInstances[processInstanceId].rootProcessInstanceId;
        if (!isSubProcess) this.cleanTempDir(processInstanceId);

        setTimeout(() => {
            this.logger.log(`[${processInstanceId}] Cleaning instance`);
            delete this.processInstances[processInstanceId];
        }, 0);
    };

    private createEngineExecutionServices = (processInstanceId: string): BpmnEngineExecuteOptions['services'] => ({
        ...customServices,
        desktop: (input: any) => async (executionContext: BpmnExecutionEventMessageApi, callback: any) => {
            const desktopTask: DesktopTask = executionContext.content;
            const script = desktopTask.input.script;
            desktopTask.input = (await FieldResolver.resolveFields(desktopTask.input)) as DesktopTask['input'];
            const executionId = input.content.executionId;
            const runboticsExecutionEnvironment: RunBoticsExecutionEnvironment = executionContext.environment;

            if (runboticsExecutionEnvironment.runbotic?.disabled) {
                this.logger.warn(`[${processInstanceId}] [${executionId}] [${script}] Desktop script is skipped`);
                callback(null, { disabled: true });
                return;
            }

            this.logger.log(`[${processInstanceId}] [${executionId}] [${script}] Running desktop script`, desktopTask.input);

            try {
                const result = await this.desktopRunnerService.run({
                    script,
                    input: desktopTask.input,
                    processInstanceId,
                    executionContext,
                    userId: this.processInstances[processInstanceId].user.id,
                    scheduled: this.processInstances[processInstanceId].scheduled,
                    rootProcessInstanceId: this.processInstances[processInstanceId].rootProcessInstanceId,
                });
                this.logger.log(
                    `[${processInstanceId}] [${executionId}] [${script}] Desktop action executed successfully`,
                    result,
                );

                callback(null, result.output);
            } catch (e) {
                this.logger.error(
                    `[${processInstanceId}] [${executionId}] [${script}] Error running desktop action`,
                    (e as Error)?.message,
                );
                callback(new Error((e as Error)?.message));
            }
        }
    });

    public terminateProcessInstance = async (processInstanceId: string): Promise<void> => {
        if (!this.engines[processInstanceId] || !this.processInstances[processInstanceId]) {
            this.logger.warn(`[${processInstanceId}] Process instance is not running`);
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
        const definitions = await this.engines[processInstanceId].getDefinitions();
        const definition = definitions[0];
        const globalVariables = { ...definition.environment.variables, ...vars };
        // globalVariables[input.variable] = input.value;
        definition.environment.assignVariables(globalVariables);
    }
}
