import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionDeleteColumns = (): IBpmnAction => ({
    id: ExcelAction.DELETE_COLUMNS,
    label: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.Label'),
    script: ExcelAction.DELETE_COLUMNS,
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
                        columnRange: {
                            title: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['columnRange'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                columnRange: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange.Info'),
                    },
                },
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                    },
                },
            },
        },
        formData: {},
    },
});

export default getActionDeleteColumns;
