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
    BpmnElementType,
    DecryptedCredential,
    GeneralAction,
    Credential,
    ActionCredentialType,
    License,
} from 'runbotics-common';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { EventEmitter } from 'events';
import { mkdirSync, rmSync } from 'fs';

import { RunboticsLogger } from '#logger';

import { Camunda } from '../CamundaExtension';
import { customServices } from '../CustomServices';
import { DesktopRunnerService } from '../desktop-runner';
import { FieldResolver } from '../FieldResolver';
import { ActivityOwner, BpmnElement, Environment, OutboundSequence } from '../bpmn.types';
import {
    DesktopTask,
    IActivityEventData,
    IBpmnEngineEvent,
    IProcessEventData,
    IStartProcessInstance,
    RunBoticsExecutionEnvironment,
    BpmnExecutionEventMessageExtendedApi,
    BpmnProcessInstance,
    BpmnExecutionEventMessageExtendedContent,
    LicenseInfo,
} from './runtime.types';
import { BpmnEngineEventBus } from './bpmn-engine.event-bus';
import { LoopHandlerService } from '../loop-handler';
import { schedulerAxios, ServerConfigService } from '#config';
import { StorageService } from '#config';
import LoopSubProcess from '#core/bpm/LoopSubProcessBehaviour';
import { PLUGIN_PREFIX } from '../desktop-runner/desktop-runner.utils';

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
        private readonly loopHandlerService: LoopHandlerService,
        private readonly serverConfigService: ServerConfigService,
        private readonly storageService: StorageService,
    ) { }

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
                    status: ProcessInstanceStatus.ERRORED,
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

    private getTempDirPath() {
        return this.serverConfigService.tempFolderPath;
    }

    private createTempDir() {
        mkdirSync(this.getTempDirPath(), { recursive: true });
    }

    private cleanTempDir = async (processInstanceId: string): Promise<void> => {
        try {
            rmSync(this.getTempDirPath(), { recursive: true });
            this.logger.log(
                `[${processInstanceId}] Deleted process instance temp directory`
            );
        } catch (error) {
            this.logger.log(
                `[${processInstanceId}] Process instance temp directory is clean`
            );
        }
    };

    public getRuntimeStatus() {
        const processInstancesCount = Object.keys(this.processInstances).length;
        const enginesCount = Object.keys(this.engines).length;

        return { processInstancesCount, enginesCount };
    }

    private async monitor() {
        setInterval(() => {
            const { processInstancesCount, enginesCount } = this.getRuntimeStatus();

            this.logger.warn(`Process instances: ${processInstancesCount} Engines: ${enginesCount}`);
        }, 60000);
    }

    public startProcessInstance = async (
        startProcessInstanceRequest: IStartProcessInstance
    ): Promise<string> => {
        const processInstanceId = uuidv4();

        const { credentials, ...request } = startProcessInstanceRequest;
        const processInstance = {
            ...request,
            id: processInstanceId,
            parentProcessInstanceId: request.parentProcessInstanceId,
            status: ProcessInstanceStatus.INITIALIZING,
            created: dayjs().toISOString(),
            ...(request.userId && { user: { id: request.userId } }),
            ...(request.callbackUrl && { callbackUrl: request.callbackUrl }),
        };

        this.processInstances[processInstanceId] = processInstance;
        this.processEventBus.publish({
            processInstanceId,
            eventType: ProcessInstanceStatus.INITIALIZING,
            processInstance,
        });
        this.createTempDir();
        setTimeout(() => {
            this.createAndStartEngine(processInstance, { ...request, credentials });
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
                    variables: {
                        ...this.processInstances[processInstanceId].variables,
                        ...execution.environment.variables,
                    },
                };
                this.processInstances[processInstanceId] = processInstance;
                this.processEventBus.publish({
                    processInstanceId: processInstance.id,
                    eventType: ProcessInstanceStatus.IN_PROGRESS,
                    processInstance,
                });
            }
        );

        listener.on('activity.start', (api: BpmnExecutionEventMessageExtendedApi) => {
            if ((api.environment as Environment).runbotic?.disabled) return;

            if ((api.environment as Environment).runbotic?.processOutput) {
                engine.execution.environment.output.BPMNElementId = api.id;
            }

            if (this.loopHandlerService.shouldSkipElement(api)) return;

            if (this.loopHandlerService.getIteratorFromElement(api)) {
                this.loopHandlerService.setIteratorName(
                    api.executionId,
                    this.loopHandlerService.getIteratorFromElement(api)
                );
            }

            if (api.content.type === BpmnElementType.EXCLUSIVE_GATEWAY) {
                prepareGatewayToFlowProcess(api);
                return;
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

        listener.on('activity.end', (api: BpmnExecutionEventMessageExtendedApi) => {
            if ((api.environment as Environment).runbotic?.disabled) return;

            this.logger.log(`${getActivityLogPrefix(api)} activity.end `);

            if (this.loopHandlerService.shouldSkipElement(api)) return;

            if (api.content.type === BpmnElementType.EXCLUSIVE_GATEWAY) return;

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

        listener.on('activity.stop', (api: BpmnExecutionEventMessageExtendedApi) => {
            this.logger.log(`${getActivityLogPrefix(api)} activity.stop`);

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.STOPPED,
                activity: api,
            });
        });

        listener.on('activity.error', (api: BpmnExecutionEventMessageExtendedApi) => {
            this.logger.error(`${getActivityLogPrefix(api)} activity.error`);

            this.activityEventBus.publish({
                processInstance,
                eventType: ProcessInstanceEventStatus.ERRORED,
                activity: api,
            });
        });

        listener.on('flow.take', (api: BpmnExecutionEventMessageExtendedApi) => {
            if (this.isSequenceFlowAfterGateway(api?.content) && !this.isSequenceWithoutExpression(api.owner)) {
                this.activityEventBus.publish({
                    processInstance,
                    eventType: ProcessInstanceEventStatus.COMPLETED,
                    activity: api,
                });
            }
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
                    error: error.message,
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

                const BPMNElementId =
                    execution.environment.output.BPMNElementId;
                if (BPMNElementId) {
                    const BPMNElement =
                        execution.definitions[0]?.getElementById(BPMNElementId) as BpmnElement;
                    const processOutputName = BPMNElement
                        .behaviour
                        .extensionElements
                        .values[0]
                        .outputParameters[0]
                        .value;

                    processInstance.processOutput = {
                        [processOutputName]: execution.environment.output[processOutputName],
                    };

                    delete execution.environment.output['BPMNElementId'];
                }

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

        const prepareGatewayToFlowProcess = (api: BpmnExecutionEventMessageExtendedApi) => {
            if (this.getSequencesWithoutExpression(api.owner as ActivityOwner).length === 0) {
                this.saveGatewayNameInCache(api);
            } else {
                this.activityEventBus.publish({
                    processInstance,
                    eventType: ProcessInstanceEventStatus.ERRORED,
                    activity: api,
                    iteratorName: this.loopHandlerService.getIteratorNameById(
                        api.content.parent.executionId
                    ),
                });
            }
        };

        const getActivityLogPrefix = (api: BpmnExecutionEventMessageExtendedApi) => {
            const activityType =
                (api.content as DesktopTask)?.input?.script ?? api.content.type;
            const activityLabel = (api.owner as ActivityOwner).behaviour.label;

            const baseLogPrefix = `[${processInstanceId}] [${api.executionId}] [${activityType}]`;

            return activityLabel
                ? `${baseLogPrefix} [${activityLabel}]`
                : baseLogPrefix;
        };

        const triggerData = request?.triggerData;
        const credentials = request?.credentials;

        const services = this.createEngineExecutionServices(
            processInstanceId,
            credentials,
        );

        const engineExecutionOptions: BpmnEngineExecuteOptions = {
            services,
            variables: {
                ...request.variables,
                tempFolder: this.getTempDirPath(),
                userEmail: triggerData && 'userEmail' in triggerData ? triggerData.userEmail : '',
            },
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

        // passed to Camunda, helps store output variables in the scope of a single process
        const processEnvironment = {};

        const typeResolver = (activityTypes) => {
            activityTypes['bpmn:SubProcess'] = LoopSubProcess;
            return activityTypes;
        };

        const engine = Engine({
            name: process.name,
            source: process.definition,
            // Logger: Logger as any,
            extensions: {
                camunda: (activity) => Camunda(activity, processEnvironment),
            },
            // elements: runboticsElements,
            moddleOptions: {
                camunda: RunboticModdleDescriptor,
            },
            expressions: {
                resolveExpression: Expressions.resolveExpression,
            },
            typeResolver,
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
        processInstanceId: string,
        credentials: DecryptedCredential[],
    ): BpmnEngineExecuteOptions['services'] => ({
        ...this.createCustomServices(processInstanceId),
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

                    const credentialType =
                        runboticsExecutionEnvironment.runbotic?.credentialType ??
                        desktopTask?.input?.credentialType;
                    const credentialId = desktopTask?.input?.customCredentialId;

                    const credentialsForAction = script !== GeneralAction.START_PROCESS
                        ? this.determineCredentialsForAction(credentialId, credentialType, credentials)
                        : credentials;

                    const licenseInfo = await this.getLicenseInfo(
                        script,
                        processInstanceId,
                        executionId,
                    );

                    this.logger.log(
                        `[${processInstanceId}] [${executionId}] [${script}] Running desktop script`,
                        desktopTask.input
                    );

                    try {
                        const result = await this.desktopRunnerService.run({
                            ...licenseInfo,
                            script,
                            credentials: credentialsForAction,
                            input: desktopTask.input,
                            processInstanceId,
                            rootProcessInstanceId:
                                this.processInstances[processInstanceId]
                                    .rootProcessInstanceId,
                            userId: this.processInstances[processInstanceId].user
                                ?.id,
                            executionContext,
                            trigger: this.processInstances[processInstanceId]
                                .trigger,
                            triggerData: this.processInstances[processInstanceId]
                                .triggerData,
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

    private async getLicenseInfo(
        script: string,
        processInstanceId: string,
        executionId: string,
    ) {
        const licenseInfo: LicenseInfo = {
            license: '',
            licenseKey: '',
        };

        if (!script.startsWith(PLUGIN_PREFIX)) {
            return licenseInfo;
        }

        try {
            const tenantId = this.storageService.getValue('tenantId');
            const pluginName = this.composePluginName(script);
            const licenseRes = (await schedulerAxios.get<License>(
                `/api/scheduler/tenants/${tenantId}/licenses/license/${pluginName}/info`
            )).data;

            licenseInfo.license = licenseRes.license;
            licenseInfo.licenseKey = licenseRes.licenseKey;
        } catch (e) {
            this.logger.log(`[${processInstanceId}] [${executionId}] [${script}] No active license found`);
        }

        return licenseInfo;
    }

    private composePluginName(script: string) {
        const scriptElement = script.split('.');
        const pluginGroup = scriptElement[1];
        const pluginPurpose = scriptElement[2];
        return `${pluginGroup}-${pluginPurpose}-plugin`;
    }

    private createCustomServices = (processInstanceId: string) => Object.entries(customServices)
        .reduce((acc, [serviceName, serviceFunction]) => {
            acc[serviceName] = (arg0?: any, arg1?: any, arg2?: any) => {
                try {
                    return serviceFunction(arg0, arg1, arg2);
                } catch (e) {
                    this.purgeEngine(processInstanceId);
                    const errorMsg = `Error in custom service [${serviceName}]: ${(e as Error)?.message}`;
                    this.logger.error(`[${processInstanceId}] ${errorMsg}`);
                    const processInstance = this.processInstances[processInstanceId];
                    this.processEventBus.publish({
                        processInstanceId: processInstanceId,
                        eventType: ProcessInstanceStatus.ERRORED,
                        processInstance: {
                            ...processInstance,
                            status: ProcessInstanceStatus.ERRORED,
                            error: errorMsg,
                        },
                    });
                    throw new Error((e as Error)?.message);
                }
            };
            return acc;
        }, {});

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
        const definitions = await this.engines[
            processInstanceId
        ].getDefinitions();
        const definition = definitions[0];
        const setVariables = {
            ...definition.environment.variables,
            ...vars,
        };

        definition.environment.assignVariables(setVariables);
    }

    public getSequencesWithoutExpression = (owner: ActivityOwner): string[] => owner.outbound
        .filter(outbound => this.hasOutputSequenceWithoutExpression(outbound))
        .map(outbound => outbound.behaviour.name ?? outbound.behaviour.id);

    private hasOutputSequenceWithoutExpression = (outbound: OutboundSequence): boolean => !outbound?.isDefault &&
        !outbound?.behaviour?.conditionExpression?.body?.trim();

    public isSequenceWithoutExpression = (owner: ActivityOwner): boolean => !owner?.isDefault &&
        !owner?.behaviour?.conditionExpression?.body?.trim();

    private saveGatewayNameInCache = (api: BpmnExecutionEventMessageExtendedApi) => {
        const gatewayName = api.name ?? api.id;
        this.storageService.setValue(api.id, gatewayName);
    };

    private isSequenceFlowAfterGateway = (content: BpmnExecutionEventMessageExtendedContent) => (
        content &&
        content.type === BpmnElementType.SEQUENCE_FLOW &&
        content.isSequenceFlow &&
        content.sourceId.includes('Gateway_')
    );

    private determineCredentialsForAction(
        credentialId: Credential['id'] | null,
        credentialTemplateName: ActionCredentialType,
        credentials: DecryptedCredential[]
    ) {
        if (!credentials) {
            return [];
        } else if (credentialId) {
            return credentials.filter((credential) =>
                credential.id === credentialId
            );
        }
        return credentials.filter((credential) =>
            credential.template === credentialTemplateName &&
            credential.order === 1
        );
    }
}
