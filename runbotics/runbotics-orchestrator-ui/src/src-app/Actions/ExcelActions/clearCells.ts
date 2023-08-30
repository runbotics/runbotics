import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionClearCells = (): IBpmnAction => ({
    id: ExcelAction.CLEAR_CELLS,
    label: translate('Process.Details.Modeler.Actions.Excel.ClearCells.Label'),
    script: ExcelAction.CLEAR_CELLS,
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
                        targetCells: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ClearCells.TargetCells'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['targetCells'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                targetCells: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ClearCells.TargetCells.Info'),
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

export default getActionClearCells;
