import { ActionRegex, ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionExportHtmlTable = (): IBpmnAction => ({
    id: ExcelAction.EXPORT_HTML_TABLE,
    label: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.Label'),
    script: ExcelAction.EXPORT_HTML_TABLE,
    runner: Runner.DESKTOP_SCRIPT,
    system: ActionSystem.WINDOWS,
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
                        cellRange: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.CellRange'),
                            type: 'string',
                        },
                        headerRow: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.HeaderRow'),
                            type: 'string',
                        },
                        rowLevel: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.RowLevel'),
                            type: 'string',
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['cellRange'],
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.Output'),
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
                cellRange: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.CellRange.Info'),
                    },
                },
                headerRow: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.HeaderRow.Info'),
                    },
                },
                rowLevel: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.RowLevel.Info'),
                    },
                },
                worksheet: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                    },
                },
            },
            output: {
                variableName: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.ExportHtmlTable.Output.Info'),
                    },
                },
            },
        },
        formData: {
            input: {
                cellRange: undefined,
            },
        },
    },
});

export default getActionExportHtmlTable;
