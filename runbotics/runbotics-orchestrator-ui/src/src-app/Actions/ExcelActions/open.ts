import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionOpen = (): IBpmnAction => ({
    id: ExcelAction.OPEN,
    label: translate('Process.Details.Modeler.Actions.Excel.Open.Label'),
    script: ExcelAction.OPEN,
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
                        path: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Open.Path.Title'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Open.Worksheet.Title'),
                            type: 'string',
                        },
                    },
                    required: ['path'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
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

export default getActionOpen;
