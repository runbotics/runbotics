import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DesktopRunRequest, StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { GeneralAction, IProcess, ProcessInstanceStatus, ITriggerEvent, BotSystemType } from 'runbotics-common';
import { delay } from '#utils';
import { RunboticsLogger } from '#logger';
import { RuntimeService } from '#core/bpm/runtime';
import { StorageService } from '#config';
import getBotSystem from '#utils/botSystem';
import { ConsoleLogActionInput, ConsoleLogActionOutput, DelayActionInput, DelayActionOutput, StartProcessActionInput, StartProcessActionOutput, ThrowErrorActionInput, ThrowErrorActionOutput } from './general.types';
import { RequestService } from '#core/auth/request.service';

export type GeneralActionRequest =
| DesktopRunRequest<GeneralAction.DELAY, DelayActionInput>
| DesktopRunRequest<GeneralAction.START_PROCESS, StartProcessActionInput>
| DesktopRunRequest<GeneralAction.CONSOLE_LOG, ConsoleLogActionInput>
| DesktopRunRequest<GeneralAction.THROW_ERROR, ThrowErrorActionInput>;

@Injectable()
export default class GeneralActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(GeneralActionHandler.name);

    constructor(
        @Inject(forwardRef(() => RuntimeService))
        private runtimeService: RuntimeService,
        private readonly storageService: StorageService,
        private readonly requestService: RequestService
    ) {
        super();
    }

    async consoleLog(input: ConsoleLogActionInput): Promise<ConsoleLogActionOutput> {
        for (const [key, value] of Object.entries(input.variables)) {
            this.logger.log(key, value);
        }
        this.logger.log('process.cwd();', process.cwd());
        return {
            variables: input.variables,
        };
    }

    async delay(input: DelayActionInput): Promise<DelayActionOutput> {
        this.logger.log('Delaying action..' + input.delay);
        await delay(input.delay * (input.unit === 'Milliseconds' ? 1 : 1000));
        return {};
    }

    async startProcess(
        request: DesktopRunRequest<GeneralAction.START_PROCESS, StartProcessActionInput>
    ): Promise<StartProcessActionOutput> {
        const tenantId = this.storageService.getValue('tenantId');
        const schedulerAxios = await this.requestService.getSchedulerAxios();
        
        const response = await schedulerAxios.get<IProcess>(
            `/api/scheduler/tenants/${tenantId}/processes/${request.input.processId}`,
            { maxRedirects: 0 },
        );

        const process = response.data;
        const processSystem = process.system.name;
        const system = getBotSystem();

        if (processSystem !== BotSystemType.ANY && processSystem !== system) {
            throw new Error(`Process with system (${processSystem}) cannot be run by the bot with system (${system})`);
        }

        const processInstanceId = await this.runtimeService.startProcessInstance({
            process: process,
            variables: request.input.variables,
            parentProcessInstanceId: request.processInstanceId,
            userId: request.userId,
            orchestratorProcessInstanceId: null,
            rootProcessInstanceId: request.rootProcessInstanceId ?? request.processInstanceId,
            trigger: request.trigger as ITriggerEvent,
            triggerData: request.triggerData,
            credentials: request.credentials,
        });

        return new Promise((resolve, reject) => {
            const subscription = this.runtimeService.processChange().subscribe((data) => {
                if (data.processInstanceId === processInstanceId) {
                    switch (data.eventType) {
                        case ProcessInstanceStatus.COMPLETED:
                        case ProcessInstanceStatus.STOPPED: {
                            const result = {
                                variables: {},
                            };
                            try {
                                result.variables = { ...data.processInstance.variables, ...data.processInstance.output };
                                delete result.variables['fields'];
                                delete result.variables['content'];
                                delete result.variables['properties'];
                            } catch (e) {
                                this.logger.error('Error getting result', e);
                            }
                            resolve(result);
                            subscription.unsubscribe();
                            break;
                        }
                        case ProcessInstanceStatus.ERRORED:
                            reject(new Error('Process errored'));
                            subscription.unsubscribe();
                            break;
                    }
                }
            });
        });
    }

    async throwError(input: ThrowErrorActionInput): Promise<ThrowErrorActionOutput> {
        throw new Error(input.message);
    }

    run(request: GeneralActionRequest) {
        switch (request.script) {
            case GeneralAction.DELAY:
                return this.delay(request.input);
            case GeneralAction.CONSOLE_LOG:
                return this.consoleLog(request.input);
            case GeneralAction.START_PROCESS:
                return this.startProcess(request);
            case GeneralAction.THROW_ERROR:
                return this.throwError(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
