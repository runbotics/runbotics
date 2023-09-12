import { SharepointExcelAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getSharepointExcelActions: () => Record<string, IBpmnAction> = () => ({
    [SharepointExcelAction.GET_CELL]: {
        id: SharepointExcelAction.GET_CELL,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.GetCell.Label'),
        script: SharepointExcelAction.GET_CELL,
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
    [SharepointExcelAction.GET_CELLS]: {
        id: SharepointExcelAction.GET_CELLS,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.GetCells.Label'),
        script: SharepointExcelAction.GET_CELLS,
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
    [SharepointExcelAction.SET_CELL]: {
        id: SharepointExcelAction.SET_CELL,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.SetCell.Label'),
        script: SharepointExcelAction.SET_CELL,
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
    [SharepointExcelAction.UPDATE_RANGE]: {
        id: SharepointExcelAction.UPDATE_RANGE,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.UpdateRange.Label'),
        script: SharepointExcelAction.UPDATE_RANGE,
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
    [SharepointExcelAction.OPEN_FILE]: {
        id: SharepointExcelAction.OPEN_FILE,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.OpenFile.Label'),
        script: SharepointExcelAction.OPEN_FILE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SharepointExcel.OpenFile.System'),
                        type: 'object',
                        properties: {
                            platform: {
                                title: translate('Process.Details.Modeler.Actions.SharepointExcel.OpenFile.System'),
                                type: 'string',
                                enum: ['OneDrive', 'SharePoint'],
                                default: 'OneDrive',
                            },
                        },
                        dependencies: {
                            platform: {
                                oneOf: [
                                    {
                                        properties: {
                                            platform: {
                                                enum: ['SharePoint'],
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
                                        required: ['siteName', 'filePath'],
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
                },
            },
        },
    },
    [SharepointExcelAction.CLOSE_SESSION]: {
        id: SharepointExcelAction.CLOSE_SESSION,
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.CloseSession.Label'),
        script: SharepointExcelAction.CLOSE_SESSION,
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
});

export default getSharepointExcelActions;
