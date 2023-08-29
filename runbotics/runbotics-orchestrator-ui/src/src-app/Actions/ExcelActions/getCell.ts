import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, RegexPattern, Runner } from '../types';

const getActionGetCell = (): IBpmnAction => ({
    id: ExcelAction.GET_CELL,
    label: translate('Process.Details.Modeler.Actions.Excel.GetCell.Label'),
    script: ExcelAction.GET_CELL,
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
                        targetCell: {
                            title: translate('Process.Details.Modeler.Actions.Excel.TargetCell'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['targetCell'],
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                            pattern: RegexPattern.VARIABLE_NAME,
                        },
                    },
                },
            },
        },
        uiSchema: {
            'ui:order': ['input', 'output'],
            input: {
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                    },
                },
                targetCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.GetCell.TargetCell.Info'),
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
                    }
                },
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.GetCell.Output.VariableName.Info'),
                        pattern: RegexPattern.VARIABLE_NAME,
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

export default getActionGetCell;
