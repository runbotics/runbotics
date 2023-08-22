import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import excelActions from './ExcelActions';
import { IBpmnAction, Runner, ActionSystem, RegexPatterns } from './types';

// eslint-disable-next-line max-lines-per-function
const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    [ExcelAction.OPEN]: {
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Open.Path.Title'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Open.Worksheet.Title'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    [ExcelAction.GET_CELL]: {
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            targetCell: {
                                title: translate('Process.Details.Modeler.Actions.Excel.TargetCell'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['targetCell'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                        },
                    },
                    targetCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.GetCell.TargetCell.Info'),
                        },
                    },
                },
                output: {
                    title: translate('Process.Details.Modeler.Actions.Common.Output'),
                    type: 'object',
                    properties: {
                        variableName: {
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                        }
                    },
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.GetCell.Output.VariableName.Info'),
                        }
                    }
                }
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [ExcelAction.GET_CELLS]: {
        id: ExcelAction.GET_CELLS,
        label: translate('Process.Details.Modeler.Actions.Excel.GetCells.Label'),
        script: ExcelAction.GET_CELLS,
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
                            startCell: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartCell'),
                                type: 'string',
                            },
                            endCell: {
                                title: translate('Process.Details.Modeler.Actions.Excel.EndCell'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['startCell', 'endCell'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            }
                        },
                        variableName: {
                            'ui:options': {
                                info: translate('Process.Details.Modeler.Actions.Excel.GetCells.Output.VariableName.Info'),
                            }
                        }
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    worksheet: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.Worksheet.Info'),
                        },
                    },
                    startCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.GetCells.StartCell.Info'),
                        },
                    },
                    endCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.GetCells.EndCell.Info'),
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
    [ExcelAction.SET_CELL]: {
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
    },
    [ExcelAction.SET_CELLS]: {
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
    },
    [ExcelAction.FIND_FIRST_EMPTY_ROW]: {
        id: ExcelAction.FIND_FIRST_EMPTY_ROW,
        label: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.Label'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startCell: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartCell'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['startCell'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    startCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartCell.Info'),
                        }
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
                            info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.Output.VariableName.Info'),
                        }
                    }
                }
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [ExcelAction.CLEAR_CELLS]: {
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
    },
    [ExcelAction.DELETE_COLUMNS]: {
        id: ExcelAction.DELETE_COLUMNS,
        label: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.Label'),
        script: ExcelAction.DELETE_COLUMNS,
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
                            columnRange: {
                                title: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.DeleteColumns.ColumnRange.Info'),
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
    },
    [ExcelAction.INSERT_COLUMNS_BEFORE]: {
        id: ExcelAction.INSERT_COLUMNS_BEFORE,
        label: translate('Process.Details.Modeler.Actions.Excel.InsertColumnsBefore.Label'),
        script: ExcelAction.INSERT_COLUMNS_BEFORE,
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
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            amount: {
                                title: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.ColumnsAmount'),
                                type: 'number',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Column.Info'),
                        },
                    },
                    amount: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Amount.Info'),
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
    },
    [ExcelAction.INSERT_COLUMNS_AFTER]: {
        id: ExcelAction.INSERT_COLUMNS_AFTER,
        label: translate('Process.Details.Modeler.Actions.Excel.InsertColumnsAfter.Label'),
        script: ExcelAction.INSERT_COLUMNS_AFTER,
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
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            amount: {
                                title: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.ColumnsAmount'),
                                type: 'number',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Column.Info'),
                        },
                    },
                    amount: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertColumns.Amount.Info'),
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
    },
    [ExcelAction.INSERT_ROWS_BEFORE]: {
        id: ExcelAction.INSERT_ROWS_BEFORE,
        label: translate('Process.Details.Modeler.Actions.Excel.InsertRowsBefore.Label'),
        script: ExcelAction.INSERT_ROWS_BEFORE,
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
                            startingRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'number',
                            },
                            rowsNumber: {
                                title: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber'),
                                type: 'number',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['startingRow', 'rowsNumber'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    startingRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.Row.Info'),
                        },
                    },
                    rowsNumber: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber.Info'),
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
    },
    [ExcelAction.INSERT_ROWS_AFTER]: {
        id: ExcelAction.INSERT_ROWS_AFTER,
        label: translate('Process.Details.Modeler.Actions.Excel.InsertRowsAfter.Label'),
        script: ExcelAction.INSERT_ROWS_AFTER,
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
                            startingRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'number',
                            },
                            rowsNumber: {
                                title: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber'),
                                type: 'number',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['startingRow', 'rowsNumber'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    startingRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.Row.Info'),
                        },
                    },
                    rowsNumber: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.InsertRows.RowsNumber.Info'),
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
    },
    [ExcelAction.CREATE_WORKSHEET]: {
        id: ExcelAction.CREATE_WORKSHEET,
        label: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Label'),
        script: ExcelAction.CREATE_WORKSHEET,
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
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Name'),
                                type: 'string',
                                pattern: RegexPatterns.EXCEL_WORKSHEET_NAME,
                            },
                        },
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            },
                        },
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    name: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Name.Info'),
                        }
                    },
                },
                output: {
                    variableName: undefined,
                },
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [ExcelAction.DELETE_WORKSHEET]: excelActions.getActionDeleteWorksheet(),
    [ExcelAction.WORKSHEET_EXISTS]: excelActions.getActionWorksheetExists(),
    [ExcelAction.RENAME_WORKSHEET]: {
        id: ExcelAction.RENAME_WORKSHEET,
        label: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.Label'),
        script: ExcelAction.RENAME_WORKSHEET,
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
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                                pattern: RegexPatterns.EXCEL_WORKSHEET_NAME,
                            },
                            newName: {
                                title: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.NewName'),
                                type: 'string',
                                pattern: RegexPatterns.EXCEL_WORKSHEET_NAME,
                            },
                        },
                        required: ['newName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    worksheet: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.Worksheet.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    newName: undefined,
                },
            },
        },
    },
    [ExcelAction.SET_ACTIVE_WORKSHEET]: {
        id: ExcelAction.SET_ACTIVE_WORKSHEET,
        label: translate('Process.Details.Modeler.Actions.Excel.SetActiveWorksheet.Label'),
        script: ExcelAction.SET_ACTIVE_WORKSHEET,
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
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['worksheet'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    worksheet: undefined,
                },
            },
        },
    },
    [ExcelAction.SAVE]: {
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
    },
    [ExcelAction.CLOSE]: {
        id: ExcelAction.CLOSE,
        label: translate('Process.Details.Modeler.Actions.Excel.Close.Label'),
        script: ExcelAction.CLOSE,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    },
});

export default getExcelActions;
