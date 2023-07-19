import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getFileActions = (): Record<string, IBpmnAction> => ({
    'file.appendFile': {
        id: 'file.appendFile',
        label: translate('Process.Details.Modeler.Actions.File.AppendFile.Label'),
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
                    output: {},
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
                    path: undefined,
                    content: undefined,
                    separator: '',
                },
                output: {},
            },
        },
    },
    'file.createFile': {
        id: 'file.createFile',
        label: translate('Process.Details.Modeler.Actions.File.CreateFile.Label'),
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
                    output: {},
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                    // fileName: "",
                },
                output: {},
            },
        },
    },
    'file.removeFile': {
        id: 'file.removeFile',
        label: translate('Process.Details.Modeler.Actions.File.RemoveFile.Label'),
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
                    output: {},
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                },
                output: {},
            },
        },
    },
    'file.readFile': {
        id: 'file.readFile',
        label: translate('Process.Details.Modeler.Actions.File.ReadFile.Label'),
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
                    path: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'file.writeFile': {
        id: 'file.writeFile',
        label: translate('Process.Details.Modeler.Actions.File.WriteFile.Label'),
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
                    output: {},
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                    content: undefined,
                },
                output: {},
            },
        },
    },
});

export default getFileActions;
