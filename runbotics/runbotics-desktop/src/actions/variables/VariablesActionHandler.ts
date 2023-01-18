import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { GlobalVariableType, IGlobalVariable } from 'runbotics-common';
import { DesktopRunRequest, DesktopRunResponse, StatelessActionHandler } from 'runbotics-sdk';
import { orchestratorAxios } from '../../config/axios-configuration';
import { RuntimeService } from '../../core/bpm/Runtime';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export type VariablesActionRequest<I> = DesktopRunRequest<any> & {
    script: 'variables.assign' | 'variables.assignList' | 'variables.assignGlobalVariable';
};

export type AssignVariableActionInput = {
    variable: string;
    value: string | string[] | boolean;
};
export type AssignVariableActionOutput = {};

@Injectable()
export class VariablesActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(VariablesActionHandler.name);

    constructor(private runtimeService: RuntimeService) {
        super();
    }

    async assignVariable(
        input: AssignVariableActionInput,
        request: VariablesActionRequest<AssignVariableActionInput>,
    ): Promise<AssignVariableActionOutput> {
        const variables = {};
        variables[input.variable] = input.value;
        // assign to local scope
        const setVariables = { ...request.executionContext.environment.variables, ...variables };
        request.executionContext.environment.assignVariables(setVariables);

        // assign to global scope
        await this.runtimeService.assignVariables(request.processInstanceId, variables);
        return {};
    }

    private mapGlobalVariableToActionInput(globalVariable: IGlobalVariable): AssignVariableActionInput {
        const actionInput: AssignVariableActionInput = { variable: globalVariable.name, value: globalVariable.value };
        if (globalVariable.type === GlobalVariableType.LIST) {
            const value = JSON.parse(globalVariable.value);
            return { ...actionInput, value };
        }

        if (globalVariable.type === GlobalVariableType.BOOLEAN) {
            const value = (globalVariable.value === 'true');
            return { ...actionInput, value };
        }

        return actionInput;
    }

    async fetchGlobalVariable(globalVariableId: number): Promise<AssignVariableActionInput> {
        const response: AxiosResponse<IGlobalVariable> = await orchestratorAxios.get(`/api/global-variables/${globalVariableId}`);
        return this.mapGlobalVariableToActionInput(response.data);
    }

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const action: VariablesActionRequest<any> = request as VariablesActionRequest<any>;
        let output: any = {};
        switch (action.script) {
            case 'variables.assign':
            case 'variables.assignList':
                output = await this.assignVariable(action.input, action);
                break;
            case 'variables.assignGlobalVariable':
                const globalVariableIds: number[] = action.input.globalVariables;
                for (const globalVariableId of globalVariableIds) {
                    const input = await this.fetchGlobalVariable(globalVariableId);
                    output = await this.assignVariable(input, action);
                }
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
