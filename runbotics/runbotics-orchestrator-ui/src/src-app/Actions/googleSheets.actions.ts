/* eslint-disable max-lines-per-function */
import { ActionRegex, GoogleAction, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getGoogleSheetsActions: () => Record<string, IBpmnAction> = () => ({
    [GoogleAction.SHEETS_GET_WORKSHEET]: {
        id: GoogleAction.SHEETS_GET_WORKSHEET,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate(
            'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.Label'
        ),
        script: GoogleAction.SHEETS_GET_WORKSHEET,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SpreadsheetID'
                                ),
                                type: 'string',
                            },
                            sheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SheetName'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['spreadsheetId'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    spreadsheetId: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SpreadsheetID.Info'
                            ),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.Output.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    [GoogleAction.SHEETS_GET_CELL]: {
        id: GoogleAction.SHEETS_GET_CELL,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate(
            'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Label'
        ),
        script: GoogleAction.SHEETS_GET_CELL,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SpreadsheetID'
                                ),
                                type: 'string',
                            },
                            cell: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Cell'
                                ),
                                type: 'string',
                            },
                            sheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SheetName'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['spreadsheetId', 'cell'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    spreadsheetId: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SpreadsheetID.Info'
                            ),
                        },
                    },
                    cell: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Cell.Info'
                            ),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Output.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    [GoogleAction.SHEETS_GET_CELLS]: {
        id: GoogleAction.SHEETS_GET_CELLS,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate(
            'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Label'
        ),
        script: GoogleAction.SHEETS_GET_CELLS,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SpreadsheetID'
                                ),
                                type: 'string',
                            },
                            range: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Range'
                                ),
                                type: 'string',
                            },
                            sheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SheetName'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['spreadsheetId', 'range'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    spreadsheetId: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SpreadsheetID.Info'
                            ),
                        },
                    },
                    range: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Range.Info'
                            ),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Output.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    [GoogleAction.SHEETS_GET_CELL_BY_VALUE]: {
        id: GoogleAction.SHEETS_GET_CELL_BY_VALUE,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate(
            'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.Label'
        ),
        script: GoogleAction.SHEETS_GET_CELL_BY_VALUE,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SpreadsheetID'
                                ),
                                type: 'string',
                            },
                            value: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SearchValue'
                                ),
                                type: 'string',
                            },
                            sheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SheetName'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['spreadsheetId', 'value'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    spreadsheetId: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SpreadsheetID.Info'
                            ),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.Output.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    [GoogleAction.SHEETS_SET_CELLS]: {
        id: GoogleAction.SHEETS_SET_CELLS,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate(
            'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Label'
        ),
        script: GoogleAction.SHEETS_SET_CELLS,
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SpreadsheetID'
                                ),
                                type: 'string',
                            },
                            range: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Range'
                                ),
                                type: 'string',
                            },
                            values: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Values'
                                ),
                                type: 'string',
                            },
                            sheet: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SheetName'
                                ),
                                type: 'string',
                            },
                        },
                        required: ['range'],
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    spreadsheetId: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SpreadsheetID.Info'
                            ),
                        },
                    },
                    range: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Range.Info'
                            ),
                        },
                    },
                    values: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Values.Info'
                            ),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Output.Info'
                            ),
                        },
                    },
                },
            },
            formData: {},
        },
    },
});

export default getGoogleSheetsActions;
