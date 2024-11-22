import { CloudExcelAction, ActionRegex, MicrosoftPlatform, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getCloudExcelActions: () => Record<string, IBpmnAction> = () => ({
    [CloudExcelAction.OPEN_FILE]: {
        id: CloudExcelAction.OPEN_FILE,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                                            siteRelativePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.Microsoft.SiteRelativePath',
                                                ),
                                                type: 'string',
                                            },
                                            listName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.Microsoft.ListName',
                                                ),
                                                type: 'string',
                                            },
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheetName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.WorksheetName',
                                                ),
                                                type: 'string',
                                            },
                                            customCredentialId: propertyCustomCredential,
                                        },
                                        required: ['siteRelativePath', 'listName', 'filePath'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.OneDrive],
                                            },
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheetName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.WorksheetName',
                                                ),
                                                type: 'string',
                                            },
                                            customCredentialId: propertyCustomCredential,
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
                    customCredentialId: schemaCustomCredential,
                    filePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.FilePath.Info'),
                        },
                    },
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Microsoft.SiteRelativePath.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    siteRelativePath: undefined,
                    filePath: undefined,
                    listName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.CREATE_WORKSHEET]: {
        id: CloudExcelAction.CREATE_WORKSHEET,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.CreateWorksheet.Label'),
        script: CloudExcelAction.CREATE_WORKSHEET,
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
                            worksheetName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.CloudExcel.CreateWorksheet.WorksheetName',
                                ),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['worksheetName'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                    worksheetName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.CreateWorksheet.WorksheetName.Info'),
                        },
                    },
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
                    worksheetName: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.GET_CELL]: {
        id: CloudExcelAction.GET_CELL,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                            isStringExpected: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.IsStringExpected'),
                                type: 'boolean',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['cell', 'isStringExpected'],
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
                    customCredentialId: schemaCustomCredential,
                    cell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Cell.Info'),
                            type: 'string',
                        },
                    },
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
                    isStringExpected: false,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.GET_CELLS]: {
        id: CloudExcelAction.GET_CELLS,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                            },
                            endCell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.EndCell'),
                                type: 'string',
                            },
                            isStringExpected: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.IsStringExpected'),
                                type: 'boolean',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['startCell', 'endCell', 'isStringExpected'],
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
                    customCredentialId: schemaCustomCredential,
                    startCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.StartCell.Info'),
                        },
                    },
                    endCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCells.EndCell.Info'),
                        },
                    },
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
                    isStringExpected: false,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.GET_WORKSHEET_CONTENT]: {
        id: CloudExcelAction.GET_WORKSHEET_CONTENT,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.GetWorksheetContent.Label'),
        script: CloudExcelAction.GET_WORKSHEET_CONTENT,
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
                            worksheetName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.CloudExcel.GetWorksheetContent.WorksheetName',
                                ),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
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
                    customCredentialId: schemaCustomCredential,
                    worksheetName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.GetWorksheetContent.WorksheetName.Info'),
                            type: 'string',
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.GetRange.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {},
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.SET_CELL]: {
        id: CloudExcelAction.SET_CELL,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.SetCell.Label'),
        script: CloudExcelAction.SET_CELL,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            value: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Value'),
                                type: 'string',
                            },
                            cell: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Cell'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['value', 'cell'],
                    }
                },
            },
            uiSchema: {
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    value: undefined,
                    cell: undefined,
                }
            },
        },
    },
    [CloudExcelAction.SET_CELLS]: {
        id: CloudExcelAction.SET_CELLS,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.SetCells.Label'),
        script: CloudExcelAction.SET_CELLS,
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
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCells.StartCell'),
                                type: 'string',
                            },
                            values: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCells.Values'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['startCell', 'values'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                    startCell: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCells.StartCell.Info'),
                        },
                    },
                    values: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCells.Values.Info'),
                        },
                    },
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
                    values: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [CloudExcelAction.DELETE_WORKSHEET]: {
        id: CloudExcelAction.DELETE_WORKSHEET,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['worksheetName'],
                    },
                },
            },
            uiSchema: {
                input: {
                    customCredentialId: schemaCustomCredential,
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
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                            },
                            endColumn: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteColumns.EndColumn'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['startColumn'],
                    },
                },
            },
            uiSchema: {
                input: {
                    customCredentialId: schemaCustomCredential,
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
    [CloudExcelAction.DELETE_ROWS]: {
        id: CloudExcelAction.DELETE_ROWS,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteRows.Label'),
        script: CloudExcelAction.DELETE_ROWS,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            rowRange: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteRows.RowRange'),
                                type: 'string'
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteRows.Worksheet'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['rowRange'],
                    },
                },
            },
            uiSchema: {
                input: {
                    customCredentialId: schemaCustomCredential,
                    rowRange: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteRows.RowRange.Info'),
                        },
                    },
                    worksheet: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.CloudExcel.DeleteRows.Worksheet.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    rowRange: undefined,
                },
            },
        },
    },
    [CloudExcelAction.CLOSE_SESSION]: {
        id: CloudExcelAction.CLOSE_SESSION,
        credentialType: ActionCredentialType.MICROSOFT_GRAPH,
        label: translate('Process.Details.Modeler.Actions.CloudExcel.CloseSession.Label'),
        script: CloudExcelAction.CLOSE_SESSION,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                properties: {
                    input: {
                        title: '',
                        type: 'object',
                        properties: {
                            customCredentialId: propertyCustomCredential,
                        },
                    },
                },
            },
            uiSchema: {
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {},
        },
    },
});

export default getCloudExcelActions;
