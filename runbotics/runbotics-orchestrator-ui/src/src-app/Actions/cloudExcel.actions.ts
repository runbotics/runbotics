import { CloudExcelAction, ActionRegex, MicrosoftPlatform } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getCloudExcelActions: () => Record<string, IBpmnAction> = () => ({
    [CloudExcelAction.GET_CELL]: {
        id: CloudExcelAction.GET_CELL,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.GetCell.Label'),
        script: CloudExcelAction.GET_CELL,
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
                            cell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Cell'),
                                type: 'string',
                            },
                        },
                        required: ['cell'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
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
                    cell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Cell.Info'),
                            type: 'string',
                            pattern: ActionRegex.EXCEL_CELL_ADDRESS
                        },
                    }
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    cell: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.GET_CELLS]: {
        id: CloudExcelAction.GET_CELLS,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.GetCells.Label'),
        script: CloudExcelAction.GET_CELLS,
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
                            startCell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.StartCell'),
                                type: 'string',
                                pattern: ActionRegex.EXCEL_CELL_ADDRESS
                            },
                            endCell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.EndCell'),
                                type: 'string',
                                pattern: ActionRegex.EXCEL_CELL_ADDRESS
                            }
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
                                pattern: ActionRegex.VARIABLE_NAME,
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
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.StartCell.Info'),
                        },
                    },
                    endCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.EndCell.Info'),
                        },
                    }
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    range: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.SET_CELL]: {
        id: CloudExcelAction.SET_CELL,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.SetCell.Label'),
        script: CloudExcelAction.SET_CELL,
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
                            content: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Content'),
                                type: 'string',
                            },
                            cell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Cell'),
                                type: 'string',
                            },
                        },
                        required: ['content', 'cell'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    content: undefined,
                    cell: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.UPDATE_RANGE]: {
        id: CloudExcelAction.UPDATE_RANGE,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.UpdateRange.Label'),
        script: CloudExcelAction.UPDATE_RANGE,
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
                            range: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Cell'),
                                type: 'string',
                            },
                            values: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Values'),
                                type: 'string',
                            },
                        },
                        required: ['range', 'values'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    range: undefined,
                    values: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.OPEN_FILE]: {
        id: CloudExcelAction.OPEN_FILE,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.OpenFile.Label'),
        script: CloudExcelAction.OPEN_FILE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            platform: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.OpenFile.Platform'),
                                type: 'string',
                                enum: [MicrosoftPlatform.OneDrive, MicrosoftPlatform.SharePoint],
                                default: 'OneDrive',
                            },
                        },
                        dependencies: {
                            platform: {
                                oneOf: [
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.SharePoint],
                                            },
                                            siteName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.SiteRelativePath',
                                                ),
                                                type: 'string',
                                            },
                                            listName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.ListName',
                                                ),
                                                type: 'string',
                                            },
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheetName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.WorksheetName',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['siteName', 'filePath', 'listName'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: ['OneDrive'],
                                            },
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheetName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.WorksheetName',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['filePath'],
                                    },
                                ],
                            },

                        },

                    },
                },
            },
            uiSchema: {
                input: {
                    listName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.ListName.Info'),
                        },
                    },
                    filePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.FilePath.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    siteName: undefined,
                    filePath: undefined,
                    listName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.CLOSE_SESSION]: {
        id: CloudExcelAction.CLOSE_SESSION,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.CloseSession.Label'),
        script: CloudExcelAction.CLOSE_SESSION,
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
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['output'],
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
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
    [CloudExcelAction.DELETE_WORKSHEET]: {
        id: CloudExcelAction.DELETE_WORKSHEET,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteWorksheet.Label'),
        script: CloudExcelAction.DELETE_WORKSHEET,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            worksheetName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.CloudExcel.DeleteWorksheet.WorksheetName',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['worksheetName'],
                    },
                },
            },
            uiSchema: {
                input: {
                    worksheetName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteWorksheet.WorksheetName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    worksheetName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.DELETE_COLUMNS]: {
        id: CloudExcelAction.DELETE_COLUMNS,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.Label'),
        script: CloudExcelAction.DELETE_COLUMNS,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.StartColumn'),
                                type: 'string',
                                pattern: ActionRegex.EXCEL_COLUMN_NAME
                            },
                            endColumn: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.EndColumn'),
                                type: 'string',
                                pattern: ActionRegex.EXCEL_COLUMN_NAME
                            }
                        },
                        required: ['startColumn'],
                    },
                },
            },
            uiSchema: {
                input: {
                    startColumn: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.StartColumn.Info'),
                        },
                    },
                    endColumn: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.EndColumn.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    startColumn: undefined,
                },
            },
        },
    },
});

export default getCloudExcelActions;
