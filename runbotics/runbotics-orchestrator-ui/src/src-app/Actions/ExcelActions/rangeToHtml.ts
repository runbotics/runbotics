import { ActionRegex, ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getRangeToHtmlAction = (): IBpmnAction => ({
    id: ExcelAction.RANGE_TO_HTML_TABLE,
    label: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.Label'),
    script: ExcelAction.RANGE_TO_HTML_TABLE,
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
                        filePath: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.FilePath'),
                            type: 'string',
                        },
                        cellRange: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.CellRange'),
                            type: 'string',
                            pattern: ActionRegex.EXCEL_CELL_RANGE,
                        },
                        headerRow: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.HeaderRow'),
                            type: 'string',
                            pattern: ActionRegex.EXCEL_ROW_NUMBER,
                        },
                        worksheet: {
                            title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                            type: 'string',
                        },
                    },
                    required: ['filePath', 'cellRange'],
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.Output'),
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
                        info: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.FilePath.Info'),
                    },
                },
                cellRange: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.CellRange.Info'),
                    },
                },
                headerRow: {
                    'ui:options': {
                        info: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.HeaderRow.Info'),
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
                        info: translate('Process.Details.Modeler.Actions.Excel.RangeToHtmlTable.Output.Info'),
                    },
                },
            },
        },
        formData: {
            input: {
                filePath: undefined,
                cellRange: undefined,
            },
        },
    },
});

export default getRangeToHtmlAction;
