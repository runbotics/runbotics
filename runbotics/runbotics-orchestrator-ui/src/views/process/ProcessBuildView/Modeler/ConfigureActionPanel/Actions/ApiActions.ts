import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const apiActions: Readonly<Record<string, IBpmnAction>> = {
    'api.request': {
        id: 'api.request',
        label: translate('Process.Details.Modeler.Actions.Api.Label'),
        script: 'api.request',
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
                        title: translate('Process.Details.Modeler.Actions.Api.Input'),
                        type: 'object',
                        properties: {
                            url: {
                                title: translate('Process.Details.Modeler.Actions.Api.Url'),
                                type: 'string',
                            },
                            headers: {
                                title: translate('Process.Details.Modeler.Actions.Api.Headers'),
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                            },
                            method: {
                                title: translate('Process.Details.Modeler.Actions.Api.Method'),
                                type: 'string',
                                enum: ['get', 'post'],
                                default: 'get',
                            },
                        },
                        required: ['url'],
                        dependencies: {
                            method: {
                                oneOf: [
                                    {
                                        properties: {
                                            method: {
                                                enum: ['get'],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            method: {
                                                enum: ['post'],
                                            },
                                            body: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Api.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Api.Output.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Api.Output.VariableMessage'),
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
                    body: {
                        'ui:widget': 'EditorWidget',
                        'ui:options': {
                            language: 'json',
                        },
                    },
                },
            },
            formData: {
                input: {
                    url: undefined,
                    method: 'get',
                    headers: {
                        Authorization: '',
                    },
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'api.downloadFile': {
        id: 'api.downloadFile',
        label: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Label'),
        script: 'api.downloadFile',
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
                        title: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Input'),
                        type: 'object',
                        properties: {
                            url: {
                                title: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Url'),
                                type: 'string',
                            },
                        },
                        required: ['url'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Api.DownloadFile.VariableText',
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
                    url: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
};

export default apiActions;
