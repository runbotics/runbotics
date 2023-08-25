import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionInsertColumnsAfter = (): IBpmnAction => ({
    id: ExcelAction.INSERT_COLUMNS_AFTER,
    label: translate('Process.Details.Modeler.Actions.Excel.InsertColumnsAfter.Label'),
    script: ExcelAction.INSERT_COLUMNS_AFTER,
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
                        column: {
                            title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                            type: 'string',
                        },
                        amount: {
                            title: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.ColumnsAmount'),
                            type: 'number',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['column', 'amount'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                column: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Column.Info'),
                    },
                },
                amount: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Amount.Info'),
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

export default getActionInsertColumnsAfter;
