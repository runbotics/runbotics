import { ExcelAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionFindFirstEmptyRow = (): IBpmnAction => ({
    id: ExcelAction.FIND_FIRST_EMPTY_ROW,
    label: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.Label'),
    script: ExcelAction.FIND_FIRST_EMPTY_ROW,
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
                        startCell: {
                            title: translate('Process.Details.Modeler.Actions.Excel.StartCell'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['startCell'],
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
            input: {
                startCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartCell.Info'),
                    }
                },
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                    },
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.Output.VariableName.Info'),
                        pattern: ActionRegex.VARIABLE_NAME,
                    }
                }
            }
        },
        formData: {
            output: {
                variableName: undefined,
            },
        },
    },
});

export default getActionFindFirstEmptyRow;
