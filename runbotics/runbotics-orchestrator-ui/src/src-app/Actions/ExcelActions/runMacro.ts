import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionsRunMacro = (): IBpmnAction => ({
    id: ExcelAction.RUN_MACRO,
    label: translate('Process.Details.Modeler.Actions.Excel.RunMacro.Label'),
    script: ExcelAction.RUN_MACRO,
    runner: Runner.DESKTOP_SCRIPT,
    system: ActionSystem.WINDOWS,
    form: {
        schema: {
            type: 'object',
            properties: {
                input: {
                    title: translate('Process.Details.Modeler.Actions.Common.Input'),
                    type: 'object',
                    properties: {
                        macro: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RunMacro.Name.Title'),
                            type: 'string',
                        },
                        functionParams: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RunMacro.FunctionParams'),
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            maxItems: 10,
                        },
                    },
                    required: ['macro'],
                },
            },
        },
        uiSchema: {},
        formData: {},
    },
});

export default getActionsRunMacro;
