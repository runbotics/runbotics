import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getSharepointExcelActions: () => Record<string, IBpmnAction> = () => ({
    'sharepointExcel.getCell': {
        id: 'sharepointExcel.getCell',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.GetCell.Label'),
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
                    cell: null,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.getRange': {
        id: 'sharepointExcel.getRange',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.GetRange.Label'),
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
                    range: null,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.setCell': {
        id: 'sharepointExcel.setCell',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.SetCell.Label'),
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
                    content: null,
                    cell: null,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.updateRange': {
        id: 'sharepointExcel.updateRange',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.UpdateRange.Label'),
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
                    range: null,
                    values: null,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.openFileFromSite': {
        id: 'sharepointExcel.openFileFromSite',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.OpenFileFromSite.Label'),
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
                            siteRelativePath: {
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
                            persistChanges: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.PersistChanges',
                                ),
                                type: 'boolean',
                            },
                        },
                        required: ['siteRelativePath', 'listName', 'filePath', 'worksheetName'],
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
                input: {
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.SiteRelativePath.Tooltip'),
                        }
                    }
                }
            },
            formData: {
                input: {
                    siteRelativePath: null,
                    listName: null,
                    filePath: null,
                    worksheetName: null,
                    persistChanges: true,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.openFileFromRoot': {
        id: 'sharepointExcel.openFileFromRoot',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.OpenFileFromRoot.Label'),
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
                    filePath: null,
                    worksheetName: null,
                    persistChanges: true,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointExcel.closeSession': {
        id: 'sharepointExcel.closeSession',
        label: translate('Process.Details.Modeler.Actions.SharepointExcel.CloseSession.Label'),
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
                    variableName: null,
                },
            },
        },
    },
});

export default getSharepointExcelActions;
