import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DesktopRunRequest, StatelessActionHandler } from 'runbotics-sdk';
import { IProcess, ITriggerEvent, ProcessInstanceStatus } from 'runbotics-common';

import { delay } from '#utils';
import { RunboticsLogger } from '#logger';
import { RuntimeService } from '#core/bpm/runtime';
import { orchestratorAxios } from '#config';

export type GeneralActionRequest =
| DesktopRunRequest<'general.delay', DelayActionInput>
| DesktopRunRequest<'general.startProcess', StartProcessActionInput>
| DesktopRunRequest<'general.console.log', ConsoleLogActionInput>;

// -- action
export type StartProcessActionInput = {
    processId: number;
    variables: Record<string, any>;
};
export type StartProcessActionOutput = {};

// -- action
export type DelayActionInput = {
    delay: number;
    unit: 'Milliseconds' | 'Seconds';
};
export type DelayActionOutput = {};

// -- action
export type ConsoleLogActionInput = {
    variables: Record<string, any>;
};
export type ConsoleLogActionOutput = {};

@Injectable()
export default class GeneralActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(GeneralActionHandler.name);

    constructor(
        @Inject(forwardRef(() => RuntimeService))
        private runtimeService: RuntimeService,
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
        request: DesktopRunRequest<'general.startProcess', StartProcessActionInput>
    ): Promise<StartProcessActionOutput> {
        return new Promise(async (resolve, reject) => {
            const response = await orchestratorAxios.get<IProcess>(
                `/api/processes/${request.input.processId}`,
                { maxRedirects: 0 },
            );
            const process = response.data;
            const processInstanceId = await this.runtimeService.startProcessInstance({
                process: process,
                variables: request.input.variables,
                userId: request.userId,
                orchestratorProcessInstanceId: null,
                rootProcessInstanceId: request.rootProcessInstanceId ?? request.processInstanceId,
                trigger: request.trigger as ITriggerEvent,
                triggerData: request.triggerData,
            });
            const subscription = this.runtimeService.processChange().subscribe((data) => {
                if (data.processInstanceId === processInstanceId) {
                    switch (data.eventType) {
                        case ProcessInstanceStatus.COMPLETED:
                        case ProcessInstanceStatus.STOPPED:
                            const result = {
                                variables: {},
                            };
                            try {
                                result.variables = data.processInstance.variables;
                            } catch (e) {
                                this.logger.error('Error getting result', e);
                            }
                            resolve(result);
                            subscription.unsubscribe();
                            break;
                        case ProcessInstanceStatus.ERRORED:
                            reject(new Error('Process errored'));
                            subscription.unsubscribe();
                            break;
                    }
                }
            });
        });
    }

    run(request: GeneralActionRequest) {
        switch (request.script) {
            case 'general.delay':
                return this.delay(request.input);
            case 'general.console.log':
                return this.consoleLog(request.input);
            case 'general.startProcess':
                return this.startProcess(request);
            default:
                throw new Error('Action not found');
        }
    }
}
