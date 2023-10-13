import { ActionRegex, ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from '../types';

const getActionExportToCsv = (): IBpmnAction => ({
    id: ExcelAction.EXPORT_TO_CSV,
    label: translate('Process.Details.Modeler.Actions.Excel.ExportToCsv.Label'),
    script: ExcelAction.EXPORT_TO_CSV,
    runner: Runner.DESKTOP_SCRIPT,
    output: {
        assignVariables: true,
        outputMethods: {
            variableName: '${content.output[0]}',
        },
    },
    form: {
        schema: {
            type: 'object',
            properties: {
                input: {
                    title: translate('Process.Details.Modeler.Actions.Common.Input'),
                    type: 'object',
                    properties: {
                        filePath: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ExportToCsv.FilePath'),
                            type: 'string',
                        },
                    },
                    required: ['filePath'],
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                            pattern: ActionRegex.VARIABLE_NAME,
                        }
                    },
                },
            },
        },
        uiSchema: {
            'ui:order': ['input', 'output'],
            input: {
                filePath: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportToCsv.FilePath.Info'),
                    },
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportToCsv.Output'),
                    },
                },
            },
        },
        formData: {},
    },
});

export default getActionExportToCsv;
