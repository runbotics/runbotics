import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from '../types';

const getActionExportToCsv = (): IBpmnAction => ({
    id: ExcelAction.EXPORT_TO_CSV,
    label: translate('Process.Details.Modeler.Actions.Excel.getActionExportToCsv.Label'),
    script: ExcelAction.EXPORT_TO_CSV,
    runner: Runner.DESKTOP_SCRIPT,
    form: {
        schema: {
            type: 'object',
            properties: {
                input: {
                    title: translate('Process.Details.Modeler.Actions.Common.Input'),
                    type: 'object',
                    properties: {
                        filePath: {
                            title: translate('Process.Details.Modeler.Actions.Excel.getActionExportToCsv.FilePath'),
                            type: 'string',
                        },
                    },
                    required: ['filePath'],
                },
            },
        },
        uiSchema: {
            'ui:order': ['input'],
            input: {
                filePath: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.getActionExportToCsv.FilePath.Info'),
                    },
                },
            },
        },
        formData: {},
    },
});

export default getActionExportToCsv;
