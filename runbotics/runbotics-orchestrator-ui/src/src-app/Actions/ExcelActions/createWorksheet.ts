import { ExcelAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionCreateWorksheet = (): IBpmnAction => ({
    id: ExcelAction.CREATE_WORKSHEET,
    label: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Label'),
    script: ExcelAction.CREATE_WORKSHEET,
    runner: Runner.DESKTOP_SCRIPT,
    system: ActionSystem.WINDOWS,
    output: {
        assignVariables: true,
        outputMethods: {
            variableName: '${content.output[0]}',
        },
    },
    form: {
        schema: {
            type: 'object',
            properties: {
                input: {
                    title: translate('Process.Details.Modeler.Actions.Common.Input'),
                    type: 'object',
                    properties: {
                        name: {
                            title: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Name'),
                            type: 'string',
                        },
                    },
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                            pattern: ActionRegex.VARIABLE_NAME,
                        },
                    },
                    required: [],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input', 'output'],
            input: {
                name: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Name.Info'),
                    }
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Output.VariableName.Info'),
                        pattern: ActionRegex.VARIABLE_NAME,
                    }
                }
            },
        },
        formData: {
            output: {
                variableName: undefined,
            },
        },
    },
});

export default getActionCreateWorksheet;
