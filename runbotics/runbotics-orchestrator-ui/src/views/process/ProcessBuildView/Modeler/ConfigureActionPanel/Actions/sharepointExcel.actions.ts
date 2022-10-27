import { translate } from 'src/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getSharepointExcelActions: () => Record<string, IBpmnAction> = () => ({
    'sharepointExcel.getCell': {
        id: 'sharepointExcel.getCell',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.GetCell.Label',
        script: 'sharepointExcel.getCell',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.GetCell.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    cell: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.getRange': {
        id: 'sharepointExcel.getRange',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.GetRange.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.GetRange.Label',
        script: 'sharepointExcel.getRange',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetRange.Input'),
                        type: 'object',
                        properties: {
                            range: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetRange.Range'),
                                type: 'string',
                            },
                        },
                        required: ['range'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetRange.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.GetRange.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.GetRange.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    range: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.setCell': {
        id: 'sharepointExcel.setCell',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.SetCell.Label',
        script: 'sharepointExcel.setCell',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.SetCell.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.SetCell.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    content: '',
                    cell: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.updateRange': {
        id: 'sharepointExcel.updateRange',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Label',
        script: 'sharepointExcel.updateRange',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    range: '',
                    values: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.openFileFromSite': {
        id: 'sharepointExcel.openFileFromSite',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Label',
        script: 'sharepointExcel.openFileFromSite',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Input'),
                        type: 'object',
                        properties: {
                            siteName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.SiteName',
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
                            persistChanges: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.PersistChanges',
                                ),
                                type: 'boolean',
                            },
                        },
                        required: ['siteName', 'listName', 'filePath', 'worksheetName'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    siteName: '',
                    listName: '',
                    filePath: '',
                    worksheetName: '',
                    persistChanges: true,
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.openFileFromRoot': {
        id: 'sharepointExcel.openFileFromRoot',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Label',
        script: 'sharepointExcel.openFileFromRoot',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Input'),
                        type: 'object',
                        properties: {
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
                            persistChanges: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.PersistChanges',
                                ),
                                type: 'boolean',
                            },
                        },
                        required: ['filePath', 'worksheetName'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    filePath: '',
                    worksheetName: '',
                    persistChanges: true,
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.closeSession': {
        id: 'sharepointExcel.closeSession',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.CloseSession.Label'),
        translateKey: 'Process.Details.Modeler.Actions.SharePointExcel.CloseSession.Label',
        script: 'sharepointExcel.closeSession',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.CloseSession.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.CloseSession.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.CloseSession.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['output'],
            },
            formData: {
                output: {
                    variableName: '',
                },
            },
        },
    },
});

export default getSharepointExcelActions;
