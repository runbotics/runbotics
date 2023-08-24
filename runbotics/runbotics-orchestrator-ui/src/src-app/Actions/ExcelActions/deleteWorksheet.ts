import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionDeleteWorksheet = (): IBpmnAction => ({
    id: ExcelAction.DELETE_WORKSHEET,
    label: translate('Process.Details.Modeler.Actions.Excel.DeleteWorksheet.Label'),
    script: ExcelAction.DELETE_WORKSHEET,
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
                        },
                    },
                    required: ['worksheet'],
                },
            },
        },
        uiSchema: {},
        formData: {
            input: {
                worksheet: undefined,
            },
        },
    },
});

export default getActionDeleteWorksheet;
