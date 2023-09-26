import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { GlobalVariableType, IGlobalVariable } from 'runbotics-common';
import { DesktopRunRequest, StatelessActionHandler } from '@runbotics/runbotics-sdk';

import { RuntimeService } from '#core/bpm/runtime';
import { orchestratorAxios } from '#config';
import { RunboticsLogger } from '#logger';

export type VariablesActionRequest =
| DesktopRunRequest<'variables.assign', AssignVariableActionInput>
| DesktopRunRequest<'variables.assignList', AssignVariableActionInput>
| DesktopRunRequest<'variables.assignGlobalVariable', AssignGlobalVariableActionInput>;

export type AssignVariableActionInput = {
    variable: string;
    value: string | string[] | boolean;
};
export type AssignVariableActionOutput = {};

export type AssignGlobalVariableActionInput = {
    globalVariables: number[];
}

@Injectable()
export default class VariableActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(VariableActionHandler.name);

    constructor(
        @Inject(forwardRef(() => RuntimeService))
        private runtimeService: RuntimeService,
    ) {
        super();
    }

    async assignVariable(
        { input, ...request }: DesktopRunRequest<string, AssignVariableActionInput>
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

    private async fetchGlobalVariable(globalVariableId: number): Promise<AssignVariableActionInput> {
        const response: AxiosResponse<IGlobalVariable> = await orchestratorAxios.get(`/api/global-variables/${globalVariableId}`);
        return this.mapGlobalVariableToActionInput(response.data);
    }

    private async assignGlobalVariable (
        request: DesktopRunRequest<'variables.assignGlobalVariable', AssignGlobalVariableActionInput>
    ) {
        const globalVariableIds = request.input.globalVariables;
        for (const globalVariableId of globalVariableIds) {
            const input = await this.fetchGlobalVariable(globalVariableId);
            await this.assignVariable({ ...request, input });
        }
    }

    async run(request: VariablesActionRequest) {
        switch (request.script) {
            case 'variables.assign':
            case 'variables.assignList':
                return this.assignVariable(request);
            case 'variables.assignGlobalVariable':
                return this.assignGlobalVariable(request);
            default:
                throw new Error('Action not found');
        }
    }
}
