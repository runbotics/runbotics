import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';

const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    'excel.setCellValue': {
        id: 'excel.setCellValue',
        label: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Label'),
        script: 'excel.setCellValue',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Path'),
                                type: 'string',
                            },
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Row'),
                                type: 'string',
                            },
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Column'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCellValue.Value'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'row', 'column', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    path: '',
                    row: '',
                    column: '',
                    value: '',
                },
            },
        },
    },
});

export default getExcelActions;
