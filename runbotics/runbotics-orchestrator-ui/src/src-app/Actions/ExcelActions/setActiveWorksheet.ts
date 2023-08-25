import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionSetActiveWorksheet = (): IBpmnAction => ({
    id: ExcelAction.SET_ACTIVE_WORKSHEET,
    label: translate('Process.Details.Modeler.Actions.Excel.SetActiveWorksheet.Label'),
    script: ExcelAction.SET_ACTIVE_WORKSHEET,
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
        uiSchema: {
            'ui:order': ['input'],
        },
        formData: {
            input: {
                worksheet: undefined,
            },
        },
    },
});

export default getActionSetActiveWorksheet;
