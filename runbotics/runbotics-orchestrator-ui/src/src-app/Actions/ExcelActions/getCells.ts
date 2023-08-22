import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, RegexPatterns, Runner } from '../types';

const getActionGetCells = (): IBpmnAction => ({
    id: ExcelAction.GET_CELLS,
    label: translate('Process.Details.Modeler.Actions.Excel.GetCells.Label'),
    script: ExcelAction.GET_CELLS,
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
                        endCell: {
                            title: translate('Process.Details.Modeler.Actions.Excel.EndCell'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['startCell', 'endCell'],
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                            pattern: RegexPatterns.VARIABLE_NAME,
                        }
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
                startCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.GetCells.StartCell.Info'),
                    },
                },
                endCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.GetCells.EndCell.Info'),
                    },
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.GetCells.Output.VariableName.Info'),
                    },
                },
            },
            formData: {},
        },
        formData: {
            output: {
                variableName: undefined,
            },
        },
    },
});

export default getActionGetCells;
