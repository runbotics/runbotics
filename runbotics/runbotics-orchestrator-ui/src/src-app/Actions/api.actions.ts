
import { ApiAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getApiActions: () => Record<string, IBpmnAction> = () => ({
    'api.request': {
        id: ApiAction.REQUEST,
        label: translate('Process.Details.Modeler.Actions.Api.Request.Label'),
        script: ApiAction.REQUEST,
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

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
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
                    url: undefined,
                    method: 'GET',
                    headers: {
                    },
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'api.downloadFile': {
        id: ApiAction.DOWNLOAD_FILE,
        label: translate('Process.Details.Modeler.Actions.Api.DownloadFile.Label'),
        script: ApiAction.DOWNLOAD_FILE,
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
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
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
