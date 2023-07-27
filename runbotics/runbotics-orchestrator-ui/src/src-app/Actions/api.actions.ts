
import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getApiActions: () => Record<string, IBpmnAction> = () => ({
    'api.request': {
        id: 'api.request',
        label: translate('Process.Details.Modeler.Actions.Api.Request.Label'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                                enum: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
                                default: 'GET',
                            },
                        },
                        required: ['url'],
                        dependencies: {
                            method: {
                                oneOf: [
                                    {
                                        properties: {
                                            method: {
                                                enum: ['GET', 'DELETE'],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            method: {
                                                enum: ['POST', 'PUT', 'PATCH'],
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
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
                    method: 'GET',
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                    url: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getApiActions;
