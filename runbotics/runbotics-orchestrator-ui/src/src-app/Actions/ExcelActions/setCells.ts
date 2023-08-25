import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionSetCells = (): IBpmnAction => ({
    id: ExcelAction.SET_CELLS,
    label: translate('Process.Details.Modeler.Actions.Excel.SetCells.Label'),
    script: ExcelAction.SET_CELLS,
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
                        startCell: {
                            title: translate('Process.Details.Modeler.Actions.Excel.StartCell'),
                            type: 'string',
                        },
                        cellValues: {
                            title: translate('Process.Details.Modeler.Actions.Excel.SetCells.CellValues'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        }
                    },
                    required: ['startCell', 'cellValues'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                startCell: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.SetCells.StartCell.Info'),
                    }
                },
                cellValues: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.SetCells.CellValues.Info'),
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

export default getActionSetCells;
