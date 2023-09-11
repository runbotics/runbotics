import { ExcelAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionReadTable = (): IBpmnAction => ({
    id: ExcelAction.READ_TABLE,
    label: translate('Process.Details.Modeler.Actions.Excel.ReadTable.Label'),
    script: ExcelAction.READ_TABLE,
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
                        tableName: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ReadTable.Table'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                        shouldIncludeHeaders: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ReadTable.ShouldIncludeHeaders'),
                            type: 'boolean',
                        },
                    },
                    required: ['tableName', 'shouldIncludeHeaders'],
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
                tableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ReadTable.Table.Info'),
                    },
                },
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                    },
                },
                shouldIncludeHeaders: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ReadTable.ShouldIncludeHeaders.Info'),
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
                    },
                },
            },
        },
        formData: {
            input: {
                shouldIncludeHeaders: true,
            },
            output: {
                variableName: undefined,
            },
        },
    },
});

export default getActionReadTable;
