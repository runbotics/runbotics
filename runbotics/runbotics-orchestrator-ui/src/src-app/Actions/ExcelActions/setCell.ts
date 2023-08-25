import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionSetCell = (): IBpmnAction => ({
    id: ExcelAction.SET_CELL,
    label: translate('Process.Details.Modeler.Actions.Excel.SetCell.Label'),
    script: ExcelAction.SET_CELL,
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
                        targetCell: {
                            title: translate('Process.Details.Modeler.Actions.Excel.TargetCell'),
                            type: 'string',
                        },
                        value: {
                            title: translate('Process.Details.Modeler.Actions.Common.Value'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['targetCell', 'value'],
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
                targetCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.SetCell.TargetCell.Info'),
                    },
                },
                value: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.SetCell.Value.Info'),
                    },
                },
            },
        },
        formData: {},
    },
});

export default getActionSetCell;
