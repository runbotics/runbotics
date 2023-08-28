import { FileAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getFileActions = (): Record<string, IBpmnAction> => ({
    'file.appendFile': {
        id: FileAction.APPEND_FILE,
        label: translate('Process.Details.Modeler.Actions.File.AppendFile.Label'),
        script: FileAction.APPEND_FILE,
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
        id: FileAction.CREATE_FILE,
        label: translate('Process.Details.Modeler.Actions.File.CreateFile.Label'),
        script: FileAction.CREATE_FILE,
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
        id: FileAction.REMOVE_FILE,
        label: translate('Process.Details.Modeler.Actions.File.RemoveFile.Label'),
        script: FileAction.REMOVE_FILE,
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
        id: FileAction.READ_FILE,
        label: translate('Process.Details.Modeler.Actions.File.ReadFile.Label'),
        script: FileAction.READ_FILE,
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
                            path: {
                                title: translate('Process.Details.Modeler.Actions.File.ReadFile.FilePath'),
                                type: 'string',
                            },
                        },
                        required: ['path'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: '^[a-zA-Z0-9_]*$',
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
                    path: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'file.writeFile': {
        id: FileAction.WRITE_FILE,
        label: translate('Process.Details.Modeler.Actions.File.WriteFile.Label'),
        script: FileAction.WRITE_FILE,
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
