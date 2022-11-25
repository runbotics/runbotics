import { Injectable } from '@nestjs/common';
import { DesktopRunRequest, DesktopRunResponse, StatelessActionHandler } from 'runbotics-sdk';
import { delay } from 'src/utils/delay';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import { IProcess, ProcessInstanceStatus } from 'runbotics-common';
import { RuntimeService } from '../../core/bpm/Runtime';
import { orchestratorAxios } from '../../config/axios-configuration';

export type GeneralActionRequest<I> = DesktopRunRequest<any> & {
    script: 'general.delay' | 'general.startProcess' | 'general.console.log';
};

// -- action
export type StartProcessActionInput = {
    processName: string;
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
class GeneralAutomation extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(GeneralAutomation.name);

    constructor(private runtimeService: RuntimeService) {
        super();
    }

    async consoleLog(input: ConsoleLogActionInput): Promise<ConsoleLogActionOutput> {
        for (let [key, value] of Object.entries(input.variables)) {
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

    async startProcess(request: DesktopRunRequest<StartProcessActionInput>): Promise<StartProcessActionOutput> {
        return new Promise(async (resolve, reject) => {
            const response = await orchestratorAxios.get<IProcess[]>(
                `/api/processes?name.equals=${request.input.processName}`,
                { maxRedirects: 0 },
            );
            const processes = response.data;
            if (processes.length == 0 || processes.length > 1) {
                reject(new Error('Error starting process, process either not found or multiple processes returned'));
                return;
            }
            const processInstanceId = await this.runtimeService.startProcessInstance({
                process: processes[0],
                params: {
                    variables: request.input.variables,
                },
                userId: request.userId,
                orchestratorProcessInstanceId: null,
                rootProcessInstanceId: request.rootProcessInstanceId ?? request.processInstanceId,
                scheduled: !!request.scheduled,
            });
            let subscription = this.runtimeService.processChange().subscribe((data) => {
                if (data.processInstanceId === processInstanceId) {
                    switch (data.eventType) {
                        case ProcessInstanceStatus.COMPLETED:
                        case ProcessInstanceStatus.STOPPED:
                            let result = {
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

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const action: GeneralActionRequest<any> = request as GeneralActionRequest<any>;
        let output: any = {};
        switch (action.script) {
            case 'general.delay':
                output = await this.delay(action.input);
                break;
            case 'general.console.log':
                output = await this.consoleLog(action.input);
                break;
            case 'general.startProcess':
                output = await this.startProcess(action);
                break;
            default:
                throw new Error('Action not found');
        }

        return {
            status: 'ok',
            output: output,
        };
    }
}

export default GeneralAutomation;
