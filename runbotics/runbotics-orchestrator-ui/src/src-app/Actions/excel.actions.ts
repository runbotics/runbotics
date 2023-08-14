import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';

// eslint-disable-next-line max-lines-per-function
const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    'excel.open': {
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Open.Path.Title'
                                ),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Open.Worksheet.Title'
                                ),
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
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    'excel.getCell': {
        id: ExcelAction.GET_CELL,
        label: translate('Process.Details.Modeler.Actions.Excel.GetCell.Label'),
        script: ExcelAction.GET_CELL,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            column: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Column'
                                ),
                                type: 'string',
                            },
                            row: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Row'
                                ),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['row', 'column'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName'
                                ),
                                type: 'string',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    worksheet: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                            ),
                        },
                    },
                },
                output: {
                    title: translate(
                        'Process.Details.Modeler.Actions.Common.Output'
                    ),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.VariableName'
                            ),
                            type: 'string',
                        },
                    },
                },
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'excel.getCells': {
        id: 'excel.getCells',
        label: translate(
            'Process.Details.Modeler.Actions.Excel.GetCells.Label'
        ),
        script: 'excel.getCells',
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            startColumn: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.StartColumn'
                                ),
                                type: 'string',
                            },
                            startRow: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.StartRow'
                                ),
                                type: 'string',
                            },
                            endColumn: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.EndColumn'
                                ),
                                type: 'string',
                            },
                            endRow: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.EndRow'
                                ),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['endColumn', 'endRow'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName'
                                ),
                                type: 'string',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    worksheet: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                            ),
                        },
                    },
                },
                formData: {},
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'excel.setCell': {
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            column: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Column'
                                ),
                                type: 'string',
                            },
                            row: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Row'
                                ),
                                type: 'string',
                            },
                            value: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Value'
                                ),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['row', 'column', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    worksheet: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    'excel.setCells': {
        id: ExcelAction.SET_CELLS,
        label: translate(
            'Process.Details.Modeler.Actions.Excel.SetCells.Label'
        ),
        script: ExcelAction.SET_CELLS,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            startColumn: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.StartColumn'
                                ),
                                type: 'string',
                            },
                            startRow: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.StartRow'
                                ),
                                type: 'string',
                            },
                            cellValues: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.SetCells.CellValues'
                                ),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['cellValues'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    startColumn: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.SetCells.StartColumn.Info'
                            ),
                        },
                    },
                    startRow: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.SetCells.StartRow.Info'
                            ),
                        },
                    },
                    cellValues: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.SetCells.CellValues.Info'
                            ),
                        },
                    },
                    worksheet: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                            ),
                        },
                    },
                },
                formData: {},
            },
            formData: {},
        },
        'excel.findFirstEmptyRow': {
            id: ExcelAction.FIND_FIRST_EMPTY_ROW,
            label: translate(
                'Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.Label'
            ),
            script: ExcelAction.FIND_FIRST_EMPTY_ROW,
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
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Input'
                            ),
                            type: 'object',
                            properties: {
                                startColumn: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.StartColumn'
                                    ),
                                    type: 'string',
                                },
                                startRow: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.StartRow'
                                    ),
                                    type: 'string',
                                },
                                worksheet: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.Worksheet'
                                    ),
                                    type: 'string',
                                },
                            },
                            required: [],
                        },
                        output: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Output'
                            ),
                            type: 'object',
                            properties: {
                                variableName: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Common.VariableName'
                                    ),
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                uiSchema: {
                    'ui:order': ['input', 'output'],
                    input: {
                        startColumn: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartColumn.Info'
                                ),
                            },
                        },
                        startRow: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartRow.Info'
                                ),
                            },
                        },
                        worksheet: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                                ),
                            },
                        },
                    },
                    output: {
                        variableName: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage'
                                ),
                            },
                        },
                    },
                },
                formData: {
                    output: {
                        variableName: undefined,
                    },
                },
            },
        },
        'excel.clearCells': {
            id: 'excel.clearCells',
            label: translate(
                'Process.Details.Modeler.Actions.Excel.ClearCells.Label'
            ),
            script: 'excel.clearCells',
            runner: Runner.DESKTOP_SCRIPT,
            system: ActionSystem.WINDOWS,
            form: {
                schema: {
                    type: 'object',
                    properties: {
                        input: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Input'
                            ),
                            type: 'object',
                            properties: {
                                targetCells: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.ClearCells.TargetCells'
                                    ),
                                    type: 'string',
                                },
                                worksheet: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.Worksheet'
                                    ),
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
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.ClearCells.TargetCells.Info'
                                ),
                            },
                        },
                        worksheet: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                                ),
                            },
                        },
                    },
                },
                formData: {},
            },
        },
        'excel.deleteColumns': {
            id: ExcelAction.DELETE_COLUMNS,
            label: translate(
                'Process.Details.Modeler.Actions.Excel.DeleteColumns.Label'
            ),
            script: ExcelAction.DELETE_COLUMNS,
            runner: Runner.DESKTOP_SCRIPT,
            system: ActionSystem.WINDOWS,
            form: {
                schema: {
                    type: 'object',
                    properties: {
                        input: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Input'
                            ),
                            type: 'object',
                            properties: {
                                columnRange: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange'
                                    ),
                                    type: 'string',
                                },
                                worksheet: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.Worksheet'
                                    ),
                                    type: 'string',
                                },
                            },
                            required: ['columnRange'],
                        },
                    },
                },
                uiSchema: {
                    'ui:order': ['input'],
                    input: {
                        columnRange: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange.Info'
                                ),
                            },
                        },
                        worksheet: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                                ),
                            },
                        },
                    },
                },
                formData: {},
            },
        },
        'excel.insertColumnsBefore': {
            id: ExcelAction.INSERT_COLUMNS_BEFORE,
            label: translate(
                'Process.Details.Modeler.Actions.Excel.InsertColumnsBefore.Label'
            ),
            script: ExcelAction.INSERT_COLUMNS_BEFORE,
            runner: Runner.DESKTOP_SCRIPT,
            system: ActionSystem.WINDOWS,
            form: {
                schema: {
                    type: 'object',
                    properties: {
                        input: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Input'
                            ),
                            type: 'object',
                            properties: {
                                column: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.StartColumn'
                                    ),
                                    type: 'string',
                                },
                                amount: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.InsertColumns.ColumnsAmount'
                                    ),
                                    type: 'number',
                                },
                                worksheet: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.Worksheet'
                                    ),
                                    type: 'string',
                                },
                            },
                            required: ['column', 'amount'],
                        },
                    },
                },
                uiSchema: {
                    'ui:order': ['input'],
                    input: {
                        column: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.InsertColumns.Column.Info'
                                ),
                            },
                        },
                        amount: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.InsertColumns.Amount.Info'
                                ),
                            },
                        },
                        worksheet: {
                            'ui:options': {
                                info: translate(
                                    'Process.Details.Modeler.Actions.Excel.Worksheet.Info'
                                ),
                            },
                        },
                    },
                },
                formData: {},
            },
        },
        'excel.save': {
            id: ExcelAction.SAVE,
            label: translate(
                'Process.Details.Modeler.Actions.Excel.Save.Label'
            ),
            script: ExcelAction.SAVE,
            runner: Runner.DESKTOP_SCRIPT,
            system: ActionSystem.WINDOWS,
            form: {
                schema: {
                    type: 'object',
                    properties: {
                        input: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Common.Input'
                            ),
                            type: 'object',
                            properties: {
                                fileName: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Excel.Save.FileName.Title'
                                    ),
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
        },
        'excel.close': {
            id: ExcelAction.CLOSE,
            label: translate(
                'Process.Details.Modeler.Actions.Excel.Close.Label'
            ),
            script: 'excel.close',
            runner: Runner.DESKTOP_SCRIPT,
            system: ActionSystem.WINDOWS,
            form: {
                schema: {},
                uiSchema: {},
                formData: {},
            },
        },
    },
});

export default getExcelActions;
