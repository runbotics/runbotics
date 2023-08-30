import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionInsertRowBefore = (): IBpmnAction => ({
    id: ExcelAction.INSERT_ROWS_BEFORE,
    label: translate('Process.Details.Modeler.Actions.Excel.InsertRowsBefore.Label'),
    script: ExcelAction.INSERT_ROWS_BEFORE,
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
                        startingRow: {
                            title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                            type: 'number',
                        },
                        rowsNumber: {
                            title: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber'),
                            type: 'number',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['startingRow', 'rowsNumber'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                startingRow: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.Row.Info'),
                    },
                },
                rowsNumber: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber.Info'),
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

export default getActionInsertRowBefore;
