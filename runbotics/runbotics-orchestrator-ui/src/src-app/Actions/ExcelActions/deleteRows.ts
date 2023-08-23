import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';
const deleteRows = (): IBpmnAction => (
    {
        id: ExcelAction.DELETE_ROWS,
        label: translate('Process.Details.Modeler.Actions.Excel.DeleteRows.Label'),
        script: ExcelAction.DELETE_ROWS,
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
                            rowRange: {
                                title: translate('Process.Details.Modeler.Actions.Excel.DeleteRows.RowRange'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['rowRange'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    rowRange: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.DeleteRows.RowRange.Info'),
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
    }
);

export default deleteRows;

