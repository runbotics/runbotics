import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionSave = (): IBpmnAction => ({
    id: ExcelAction.SAVE,
    label: translate('Process.Details.Modeler.Actions.Excel.Save.Label'),
    script: ExcelAction.SAVE,
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
                        fileName: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Save.FileName.Title'),
                            type: 'string',
                        },
                    },
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
        },
        formData: {},
    },
});

export default getActionSave;
