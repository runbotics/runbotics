import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { GlobalVariableType, IGlobalVariable } from 'runbotics-common';
import { DesktopRunRequest, StatelessActionHandler } from '@runbotics/runbotics-sdk';

import { RuntimeService } from '#core/bpm/runtime';
import {  StorageService } from '#config';
import { RunboticsLogger } from '#logger';
import { RequestService } from '#core/auth/request.service';

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
        private readonly storageService: StorageService,
        private readonly requestService: RequestService
    ) {
        super();
    }

    async assignVariable(
        { input, ...request }: DesktopRunRequest<string, AssignVariableActionInput>
    ): Promise<AssignVariableActionOutput> {
        const variables = {};
        variables[input.variable] = input.value;
        const setVariables = { ...request.executionContext.environment.variables, ...variables };
        request.executionContext.environment.assignVariables(setVariables);

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

    private async fetchGlobalVariable(globalVariableId: number): Promise<AxiosResponse<IGlobalVariable>> {
        const schedulerAxios = await this.requestService.getSchedulerAxios();

        const tenantId = this.storageService.getValue('tenantId');
        return await schedulerAxios.get(`/api/scheduler/tenants/${tenantId}/global-variables/${globalVariableId}`);
    }

    private async assignGlobalVariable (
        request: DesktopRunRequest<'variables.assignGlobalVariable', AssignGlobalVariableActionInput>
    ) {
        const globalVariableIds = request.input.globalVariables;
        for (const globalVariableId of globalVariableIds) {
            const { data: globalVariable } = await this.fetchGlobalVariable(globalVariableId)
                .catch((error) => {
                    throw new Error(`An error occurred during ${globalVariable.id} fetch: ${error}`);
                });
            const input = this.mapGlobalVariableToActionInput(globalVariable);
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
