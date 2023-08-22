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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
                                type: 'string',
                            },
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['row', 'column'],
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
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'excel.getCells': {
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
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            startRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'string',
                            },
                            endColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.EndColumn'),
                                type: 'string',
                            },
                            endRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.EndRow'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['endColumn', 'endRow'],
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
                                type: 'string',
                            },
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
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
                        required: ['row', 'column', 'value'],
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
    'excel.setCells': {
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
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            startRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'string',
                            },
                            cellValues: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCells.CellValues'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
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
                            info: translate('Process.Details.Modeler.Actions.Excel.SetCells.StartColumn.Info'),
                        },
                    },
                    startRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.SetCells.StartRow.Info'),
                        },
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
    'excel.findFirstEmptyRow': {
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
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            startRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: [],
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
                    startColumn: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartColumn.Info'),
                        },
                    },
                    startRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.FindFirstEmptyRow.StartRow.Info'),
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
                            info: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
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
    'excel.deleteColumns': {
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
    'excel.insertColumnsBefore': {
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
    'excel.insertColumnsAfter': {
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
                            },
                        },
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    name: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.CreateWorksheet.Name.Info'),
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
    [ExcelAction.DELETE_WORKSHEET]: {
        id: ExcelAction.DELETE_WORKSHEET,
        label: translate('Process.Details.Modeler.Actions.Excel.DeleteWorksheet.Label'),
        script: ExcelAction.DELETE_WORKSHEET,
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
            uiSchema: {},
            formData: {
                input: {
                    worksheet: undefined,
                },
            },
        },
    },
    [ExcelAction.WORKSHEET_EXISTS]: {
        id: ExcelAction.WORKSHEET_EXISTS,
        label: translate('Process.Details.Modeler.Actions.Excel.WorksheetExists.Label'),
        script: ExcelAction.WORKSHEET_EXISTS,
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
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['worksheet'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'boolean',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                formData: {},
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
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
                            },
                            newName: {
                                title: translate('Process.Details.Modeler.Actions.Excel.RenameWorksheet.NewName'),
                                type: 'string',
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
    'excel.save': {
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
    'excel.close': {
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
