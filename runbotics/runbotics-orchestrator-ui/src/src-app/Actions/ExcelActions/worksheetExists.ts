import { ExcelAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionWorksheetExists = (): IBpmnAction => ({
    id: ExcelAction.WORKSHEET_EXISTS,
    label: translate('Process.Details.Modeler.Actions.Excel.WorksheetExists.Label'),
    script: ExcelAction.WORKSHEET_EXISTS,
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
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                            pattern: ActionRegex.EXCEL_WORKSHEET_NAME,
                        },
                    },
                    required: ['worksheet'],
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
                },
            },
        },
        uiSchema: {
            'ui:order': ['input', 'output'],
            formData: {},
            input: {
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.WorksheetExists.Worksheet.Info'),
                    },
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.WorksheetExists.Output.VariableName.Info'),
                        pattern: ActionRegex.VARIABLE_NAME,
                    }
                },
            }
        },
        formData: {
            output: {
                variableName: undefined,
            },
        },
    },
});

export default getActionWorksheetExists;
