import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, RegexPattern, Runner } from '../types';

const getActionRenameWorksheet = (): IBpmnAction => ({
    id: ExcelAction.RENAME_WORKSHEET,
    label: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.Label'),
    script: ExcelAction.RENAME_WORKSHEET,
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
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                            pattern: RegexPattern.EXCEL_WORKSHEET_NAME,
                        },
                        newName: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.NewName'),
                            type: 'string',
                            pattern: RegexPattern.EXCEL_WORKSHEET_NAME,
                        },
                    },
                    required: ['newName'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.Worksheet.Info'),
                    },
                },
            },
        },
        formData: {
            input: {
                newName: undefined,
            },
        },
    },
});

export default getActionRenameWorksheet;
