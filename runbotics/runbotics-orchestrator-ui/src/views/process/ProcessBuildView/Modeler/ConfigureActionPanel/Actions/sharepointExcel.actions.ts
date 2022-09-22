import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const getSharepointExcelActions: () => Record<string, IBpmnAction> = () => ({
    'sharepointExcel.getCell': {
        id: 'sharepointExcel.getCell',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.GetCell.Label'),
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
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    range: 'A1:B2',
                    values: '#{variable}',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sharepointExcel.open': {
        id: 'sharepointExcel.open',
        label: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.Label'),
        script: 'sharepointExcel.open',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.Input'),
                        type: 'object',
                        properties: {
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.FileName'),
                                type: 'string',
                            },
                            worksheetName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.WorksheetName'),
                                type: 'string',
                            },
                            persistChanges: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.PersistChanges'),
                                type: 'boolean',
                            },
                        },
                        required: ['fileName', 'worksheetName'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointExcel.Open.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointExcel.Open.VariableText',
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
                    fileName: '',
                    worksheetName: '',
                    persistChanges: true,
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
}) 

export default getSharepointExcelActions;
