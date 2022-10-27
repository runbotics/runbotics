import { translate } from 'src/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getFileActions: () => Record<string, IBpmnAction> = () => ({
    'file.appendFile': {
        id: 'file.appendFile',
        label: translate('Process.Details.Modeler.Actions.File.AppendFile.Label'),
        translateKey: 'Process.Details.Modeler.Actions.File.AppendFile.Label',
        script: 'file.appendFile',
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
                        title: translate('Process.Details.Modeler.Actions.File.AppendFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.AppendFile.FilePath'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.File.AppendFile.Content'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.File.AppendFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.File.AppendFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.File.AppendFile.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.File.AppendFile.VariableText',
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
                    content: {
                        'ui:widget': 'textarea',
                    },
                },
            },
            formData: {
                input: {
                    path: '',
                    content: '',
                    separator: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'file.createFile': {
        id: 'file.createFile',
        label: translate('Process.Details.Modeler.Actions.File.CreateFile.Label'),
        translateKey: 'Process.Details.Modeler.Actions.File.CreateFile.Label',
        script: 'file.createFile',
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
                        title: translate('Process.Details.Modeler.Actions.File.CreateFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.CreateFile.FilePath'),
                                type: 'string',
                            },
                            // 'fileName': {
                            //     'title': '(example.txt)',
                            //     'type': 'string'
                            // },
                        },
                        required: [
                            'path',
                            // 'fileName',
                        ],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.File.CreateFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.File.CreateFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.File.CreateFile.VariableText'),
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
                    path: '',
                    // fileName: "",
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'file.removeFile': {
        id: 'file.removeFile',
        label: translate('Process.Details.Modeler.Actions.File.RemoveFile.Label'),
        translateKey: 'Process.Details.Modeler.Actions.File.RemoveFile.Label',
        script: 'file.removeFile',
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
                        title: translate('Process.Details.Modeler.Actions.File.RemoveFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.RemoveFile.FilePath'),
                                type: 'string',
                            },
                        },
                        required: ['path'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.File.RemoveFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.File.RemoveFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.File.RemoveFile.VariableText'),
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
                    path: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'file.readFile': {
        id: 'file.readFile',
        label: translate('Process.Details.Modeler.Actions.File.ReadFile.Label'),
        translateKey: 'Process.Details.Modeler.Actions.File.ReadFile.Label',
        script: 'file.readFile',
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
                        title: translate('Process.Details.Modeler.Actions.File.ReadFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.ReadFile.FilePath'),
                                type: 'string',
                            },
                        },
                        required: ['path'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.File.ReadFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.File.ReadFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.File.ReadFile.VariableText'),
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
                    path: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'file.writeFile': {
        id: 'file.writeFile',
        label: translate('Process.Details.Modeler.Actions.File.WriteFile.Label'),
        translateKey: 'Process.Details.Modeler.Actions.File.WriteFile.Label',
        script: 'file.writeFile',
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
                        title: translate('Process.Details.Modeler.Actions.File.WriteFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.WriteFile.FilePath'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.File.WriteFile.Content'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.File.WriteFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.File.WriteFile.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.File.WriteFile.VariableText',
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
                    path: '',
                    content: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
});

export default getFileActions;
