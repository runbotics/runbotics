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
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    cell: undefined,
                },
                output: {
                    variableName: undefined,
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    range: undefined,
                },
                output: {
                    variableName: undefined,
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
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    content: undefined,
                    cell: undefined,
                },
                output: {
                    variableName: undefined,
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
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    range: undefined,
                    values: undefined,
                },
                output: {
                    variableName: undefined,
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    siteRelativePath: undefined,
                    listName: undefined,
                    filePath: undefined,
                    worksheetName: undefined,
                    persistChanges: true,
                },
                output: {
                    variableName: undefined,
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    filePath: undefined,
                    worksheetName: undefined,
                    persistChanges: true,
                },
                output: {
                    variableName: undefined,
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableMessage',
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
                    variableName: undefined,
                },
            },
        },
    },
});

export default getSharepointExcelActions;
